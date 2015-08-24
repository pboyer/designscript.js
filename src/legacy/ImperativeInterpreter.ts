import * as AST from '../AST';
import { Visitor } from '../Visitor';
import { Environment } from '../Environment';
import { AssociativeInterpreter } from './AssociativeInterpreter';
import { Replicator } from '../Replicator';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from '../RuntimeTypes';
import { Range } from '../Range';

export class ImperativeInterpreter implements Visitor<any>{

    env: Environment = new Environment();

    constructor() {
        this.addBuiltins();
    }

    run(sl: AST.StatementListNode): void {
        this.evalFunctionDefinitionNodes(sl);
        return this.visitStatementListNode(sl);
    }

    lookup(id: string): any {
        return this.env.lookup(id);
    }

    set(id: string, val: any): any {
        return this.env.set(id, val);
    }

    addBuiltins() {
        this.set('print', new TypedFunction((x) => console.log(x), [new TypedArgument('a', 'var')], 'print'));
    }

    evalFunctionDefinitionNodes(sl: AST.StatementListNode): void {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (s instanceof AST.FunctionDefinitionNode)
                s.accept(this);
        }
    }

    pushEnvironment(): void {
        this.env = new Environment(this.env);
    }

    popEnvironment(): void {
        if (this.env == null) throw new Error('Cannot pop empty environment!');

        this.env = this.env.outer;
    }

    visitStatementListNode(sl: AST.StatementListNode): any {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
          
            // empty statement list
            if (!s) break;

            // todo: hoist func defs
            if (!(s instanceof AST.FunctionDefinitionNode))
                r = s.accept(this);
        }

        return r;
    }

    visitArrayIndexNode(e: AST.ArrayIndexNode): any {
        var array = e.array.accept(this);
        var index = e.index.accept(this);
        return array[index];
    }

    visitArrayNode(e: AST.ArrayNode): any[] {
        return e.expressionList.accept(this);
    }

    visitStringNode(e: AST.StringNode): string {
        return e.value;
    }

    visitBooleanNode(e: AST.BooleanNode): boolean {
        return e.value;
    }

    visitNumberNode(e: AST.NumberNode): Number {
        return e.value;
    }

    visitIdentifierNode(e: AST.IdentifierNode): any {
        return this.lookup(e.name);
    }

    visitIdentifierListNode(n: AST.IdentifierListNode): any {
        throw new Error('Not implemented!');
    }

    visitRangeExpressionNode(node: AST.RangeExpressionNode): number[] {

        var start = node.start.accept(this);
        if (typeof start != 'number') throw this.error('start must be a number.', node.parserState);

        var end = node.end.accept(this);
        if (typeof end != 'number') throw this.error('end must be a number.', node.parserState);

        if (!node.step) return Range.byStartEnd(start, end);

        var step = node.step.accept(this);
        if (typeof step != 'number') throw this.error('step must be a number.', node.parserState);

        return node.isStepCount ?
            Range.byStepCount(start, end, step) :
            Range.byStepSize(start, end, step);
    };

    visitBinaryExpressionNode(e: AST.BinaryExpressionNode): any {

        var a = e.firstExpression.accept(this);
        var b = e.secondExpression.accept(this);

        switch (e.operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '<':
                return a < b;
            case '||':
                return a || b;
            case '==':
                return a == b;
            case '>':
                return a > b;
        }

        throw this.error('Unknown binary operator type', e.parserState);
    }

    visitIfStatementNode(s: AST.IfStatementNode) {
        var test = s.testExpression.accept(this);
        if (test === true) {
            return this.evalBlockStatement(s.trueStatementList);
        } else {
            return s.falseStatementList.accept(this);
        }
    }

    evalBlockStatement(sl: AST.StatementListNode): any {
        this.pushEnvironment();
        var r = sl.accept(this);
        this.popEnvironment();
        return r;
    }

    visitFunctionCallNode(e: AST.FunctionCallNode): any {
        var fd = this.lookup(e.functionId.name);

        if (!(fd instanceof TypedFunction)) {
            throw this.error(e.functionId.name + ' is not a function!', e.parserState);
        }

        return Replicator.replicate(fd, e.arguments.accept(this));
    }

    visitReplicationExpressionNode(fa: AST.ReplicationExpressionNode): any {
        return new ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList.accept(this))
    }

    visitReplicationGuideListNode(rl: AST.ReplicationGuideListNode): number[] {
        var vs = [];
        while (rl != undefined) {
            vs.push(rl.head.accept(this));
            rl = rl.tail;
        }
        return vs;
    }

    visitReplicationGuideNode(r: AST.ReplicationGuideNode): number {
        return r.index.accept(this);
    }

    visitExpressionListNode(el: AST.ExpressionListNode) {
        var vs = [];
        while (el != undefined) {
            vs.push(el.head.accept(this));
            el = el.tail;
        }
        return vs;
    }

    visitAssignmentNode(s: AST.AssignmentNode) {
        var v = s.expression.accept(this);
        this.set(s.identifier.name, v);
        return v;
    }

    visitFunctionDefinitionNode(fds: AST.FunctionDefinitionNode): any {
 
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new TypedArgument(il.head.name, t ? t.name : undefined));

            il = il.tail;
        }

        var fd;
        var env = this.env;
        var interpreter = this;

        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        
        // recursion
        env.set(fds.identifier.name, f);

        fd = new TypedFunction(f, val, fds.identifier.name);

        this.set(fds.identifier.name, fd);
    }

    apply(fd: AST.FunctionDefinitionNode, env: Environment, args: any[]): any {

        env = new Environment(env);

        // bind the arguments in the scope 
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            env.set(il.head.name, args[i++]);
            il = il.tail;
        };

        var current = this.env;
        this.env = env;

        var r = fd.body.accept(this);

        this.env = current;
        return r;
    }

    visitImperativeBlockNode(node: AST.ImperativeBlockNode): any {
        var i = new ImperativeInterpreter();
        return i.run(node.statementList);
    };

    visitAssociativeBlockNode(node: AST.AssociativeBlockNode): any {
        var i = new AssociativeInterpreter();
        return i.run(node.statementList).value;
    };
    
    error(message : string, state: AST.ParserState ) : DesignScriptError {
        return new DesignScriptError( message, state );
    }
}
