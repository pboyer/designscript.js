import enviro = require('./environment');
import ast = require('./ast');
import visitor = require('./visitor');
import types = require('./types');
import replicator = require('./replicator');
import interpreter = require('./interpreter');

export class ImperativeInterpreter implements visitor.Visitor<any>, interpreter.Interpreter {

    replicator: replicator.Replicator = new replicator.Replicator();
    env: enviro.Environment = new enviro.Environment();
    parent: interpreter.Interpreter;

    constructor(parent : interpreter.Interpreter = null) {
        this.parent = parent;
        this.addBuiltins();
    }

    run(sl: ast.StatementListNode): void {
        this.evalFunctionDefinitionNodes(sl);
        return this.visitStatementListNode(sl);
    }
    
    lookup(id : string) : any {
        return this.env.lookup(id);
    }
    
    set(id : string, val : any) : any {
        return this.env.set(id, val);
    }

    addBuiltins() {
        this.set("print", new types.TypedFunction((x) => console.log(x), [ new types.TypedArgument("a", "var") ], "print"));
    }

    evalFunctionDefinitionNodes(sl: ast.StatementListNode): void {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (s instanceof ast.FunctionDefinitionNode)
                s.accept(this);
        }
    }

    pushEnvironment(): void {
        this.env = new enviro.Environment(this.env);
    }

    popEnvironment(): void {
        if (this.env == null) throw new Error("Cannot pop empty environment!");

        this.env = this.env.outer;
    }

    visitStatementListNode(sl: ast.StatementListNode): any {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
          
            // empty statement list
            if (!s) break;

            // todo: hoist func defs
            if (!(s instanceof ast.FunctionDefinitionNode))
                r = s.accept(this);
        }

        return r;
    }

    visitReplicationGuideListNode(r: ast.ReplicationGuideListNode): any {
        throw new Error("visitReplicatedGuideListNode not implemented");
    }

    visitReplicationGuideNode(r: ast.ReplicationGuideNode): any {
        throw new Error("visitReplicatedGuideNode not implemented");
    }

    visitArrayIndexNode(e: ast.ArrayIndexNode): any {
        var array = e.array.accept(this);
        var index = e.index.accept(this);
        return array[index];
    }

    visitArrayNode(e: ast.ArrayNode): any[] {
        return e.expressionList.accept(this);
    }

    visitStringNode(e: ast.StringNode): string {
        return e.value;
    }

    visitBooleanNode(e: ast.BooleanNode): boolean {
        return e.value;
    }

    visitNumberNode(e: ast.NumberNode): Number {
        return e.value;
    }

    visitIdentifierNode(e: ast.IdentifierNode): any {
        return this.lookup(e.name);
    }

    visitIdentifierListNode(n: ast.IdentifierListNode): any {
        return null;
    }

    visitBinaryExpressionNode(e: ast.BinaryExpressionNode): any {
        switch (e.operator) {
            case "+":
                return e.firstExpression.accept(this) + e.secondExpression.accept(this);
            case "-":
                return e.firstExpression.accept(this) - e.secondExpression.accept(this);
            case "*":
                return e.firstExpression.accept(this) * e.secondExpression.accept(this);
            case "<":
                return e.firstExpression.accept(this) < e.secondExpression.accept(this);
            case "||":
                return e.firstExpression.accept(this) || e.secondExpression.accept(this);
            case "==":
                return e.firstExpression.accept(this) == e.secondExpression.accept(this);
            case ">":
                return e.firstExpression.accept(this) > e.secondExpression.accept(this);
        }

        throw new Error("Unknown binary operator type");
    }

    visitReturnNode(s: ast.ReturnNode) {
        return s.expression.accept(this);
    }

    visitIfStatementNode(s: ast.IfStatementNode) {
        var test = s.testExpression.accept(this);
        if (test === true) {
            return this.evalBlockStatement(s.trueStatementList);
        } else {
            return s.falseStatementList.accept(this);
        }
    }

    evalBlockStatement(sl: ast.StatementListNode): any {
        this.pushEnvironment();
        var r = sl.accept(this);
        this.popEnvironment();
        return r;
    }

    visitFunctionCallNode(e: ast.FunctionCallNode): any {
        var fd = this.lookup(e.functionId.name);
        
        // TODO incorporate replication guide info
        return this.replicator.replicate(fd, e.arguments.accept(this));
    }

    visitReplicationExpressionNode(fa: ast.ReplicationExpressionNode): any {
        return new types.ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList)
    }

    visitExpressionListNode(el: ast.ExpressionListNode) {
        var vs = [];
        while (el != undefined) {
            vs.push(el.head.accept(this));
            el = el.tail;
        }
        return vs;
    }

    visitAssignmentNode(s: ast.AssignmentNode) {
        this.set(s.identifier.name, s.expression.accept(this));
    }

    visitFunctionDefinitionNode(fds: ast.FunctionDefinitionNode): any {
 
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new types.TypedArgument(il.head.name, t ? t.name : undefined ));
            
            il = il.tail;
        }

        var fd;
        var env = this.env;
        var interpreter = this;

        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }

        fd = new types.TypedFunction(f, val, fds.identifier.name);

        this.set(fds.identifier.name, fd);
    }

    apply(fd: ast.FunctionDefinitionNode, env: enviro.Environment, args: any[]): any {

        env = new enviro.Environment(env);

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

    visitImperativeBlockNode(node : ast.ImperativeBlockNode) : any { throw new Error("Not implemented"); };
    visitAssociativeBlockNode(node : ast.AssociativeBlockNode) : any { throw new Error("Not implemented"); };
}
