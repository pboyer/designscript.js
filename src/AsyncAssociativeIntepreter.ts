/// <reference path="../typings/es6-promise.d.ts"/>
import * as AST from './AST';
import { DependencyNode } from './AssociativeInterpreter';
import { Environment } from './Environment';
import { Visitor } from './Visitor';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { Replicator } from './Replicator';

export class AsyncAssociativeInterpreter implements Visitor<Promise<DependencyNode>> {

    env = new Environment();

    constructor() {
        this.addBuiltins();
    }

    lookup(id: string): DependencyNode | TypedFunction {
        return this.env.lookup(id);
    }

    set(id: string, val: DependencyNode | TypedFunction): void {
        return this.env.set(id, val);
    }

    addBuiltins() {
        this.set('print', new TypedFunction((x) => console.log(x), [new TypedArgument('a', 'var')], 'print'));
    }
    
    visitStatementListNode(sl: AST.StatementListNode): Promise<DependencyNode> { 
        var r, s, pp;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (!sl) break;
            s.accept(this)
        }
        
        this.debug();
        
        return pp;
    }
    
    pending : (() => any)[] = [];
    
    debug(){
        while( this.pending.length ){
            var p = this.pending.shift();
            p();
            console.log('step', this.pending.length);
            // if debugger attached and is break point, stop
        }
    }
    
    continue(){
        this.debug();
    }

    deferDebug(node : AST.Node) : Promise<{}> {
        var r;
        
        var p = new Promise(function(resolve, reject){ r = resolve; });
        this.pending.push( () => {
            r();
        });
        
        return p;
    }
    
    visitIdentifierNode(node: AST.IdentifierNode): Promise<DependencyNode> {
        console.log('IdentifierNode');
        return this.deferDebug(node).then(() => this.lookup(node.name));
    }

    visitAssignmentNode(node: AST.AssignmentNode): Promise<DependencyNode> {
        console.log('AssignmentNode');
        var d = this.deferDebug(node);
        var pe = node.expression.accept(this);
        var id = node.identifier.name;
        return Promise.all([d,pe]).then((ps) => { this.env.set(id, ps[0]); return ps[1]; })
    }

    visitNumberNode(node: AST.NumberNode): Promise<DependencyNode> {
        console.log('NumberNode');
        return this.deferDebug(node).then(() => DependencyNode.constant(node.value));
    }
    
    visitBinaryExpressionNode(node: AST.BinaryExpressionNode): Promise<DependencyNode> {
        console.log('BinaryExpressionNode');
        var dp = this.deferDebug(node);
        var ap = node.firstExpression.accept(this);
        var bp = node.secondExpression.accept(this);
        
        return Promise.all([dp,ap,bp]).then((dns) => {
            
            console.log('hi!');
            // TODO lookup type
            var n = new DependencyNode((a, b) => a + b);

            connect(dns[1], n, 0);
            connect(dns[2], n, 1);
    
            return n.eval();
        });
    }

    visitFunctionCallNode(node: AST.FunctionCallNode): Promise<DependencyNode> {
        console.log('FunctionCallNode');
        var f = this.lookup(node.functionId.name);

        if (f instanceof TypedFunction) {
            var d = this.deferDebug(node);

            // unpack the dependencies
            var el = node.arguments;
            var i = 0;
            var dependencies = [ this.deferDebug(node) ];
            while (el) {
                var e = el.head;
                el = el.tail;
                dependencies.push(e.accept(this));
            }
            
            // when all of the promises are ready, do the function call
            return Promise.all(dependencies).then((deps) => {
                var n = new DependencyNode(function() { return Replicator.replicate(f, Array.prototype.slice.call(arguments)); });

                deps.slice(1).forEach((d : DependencyNode) => {
                    connect(d, n, i++);
                });

                return n.eval();
            });
        }

        throw this.error(node.functionId.name + ' is not a function.', node.parserState);
    }

    visitIdentifierListNode(node: AST.IdentifierListNode): Promise<DependencyNode> { return null; }
    visitBooleanNode(node: AST.BooleanNode): Promise<DependencyNode> { return null; }
    visitStringNode(node: AST.StringNode): Promise<DependencyNode> { return null; }
    visitArrayNode(node: AST.ArrayNode): Promise<DependencyNode> { return null; }
    visitRangeExpressionNode(node: AST.RangeExpressionNode): Promise<DependencyNode> { return null; }
    visitArrayIndexNode(node: AST.ArrayIndexNode): Promise<DependencyNode> { return null; }
    visitExpressionListNode(node: AST.ExpressionListNode): Promise<DependencyNode> { return null; }
    visitIfStatementNode(node: AST.IfStatementNode): Promise<DependencyNode> { return null; }
    visitFunctionDefinitionNode(node: AST.FunctionDefinitionNode): Promise<DependencyNode> { return null; }
    visitReplicationExpressionNode(node: AST.ReplicationExpressionNode): Promise<DependencyNode> { return null; }
    visitReplicationGuideNode(node: AST.ReplicationGuideNode): Promise<DependencyNode> { return null; }
    visitReplicationGuideListNode(node: AST.ReplicationGuideListNode): Promise<DependencyNode> { return null; }
    visitImperativeBlockNode(node: AST.ImperativeBlockNode): Promise<DependencyNode> { return null; }
    visitAssociativeBlockNode(node: AST.AssociativeBlockNode): Promise<DependencyNode> { return null; }

    error(message: string, state: AST.ParserState): DesignScriptError {
        return new DesignScriptError(message, state);
    }
}

function connect(s: DependencyNode, e: DependencyNode, i: number) {
    if (s === e) throw new Error('Cannot connect a node to itself');

    s.outputs.push(e);
    e.inputs[i] = s;
}

function disconnect(s: DependencyNode, e: DependencyNode, i: number) {
    var i = s.outputs.indexOf(e)
    s.outputs.splice(i, 1);

    e.inputs[i] = null;
}
