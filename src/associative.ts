export class Node {
    dirty : boolean = true;
    inputs : Node[] = [];
    outputs : Node[] = [];
    value : any = null;    
    f : (...any : any[]) => any;  

    constructor( f : (...any : any[]) => any ){
        this.f = f;        
    }

    eval() {
        this.value = this.f.apply(null, this.inputs.map( (x) => x.value ));
    }
}

import visitor = require('./visitor');
import ast = require('./ast');

export class AssociativeInterpreter implements visitor.Visitor<Node> {

    dict : { [ id : string ] : any; } = {};

    private resolve( node : Node ){
        
        // mark the nodes
        var n, marked, remaining = [ node ];
        while (remaining.length){
            n = remaining.pop();
            
            if (n.dirty) continue;

            n.dirty = true;
            n.outputs.forEach((x) => remaining.push(x));
            marked.push(n);
        }
            
        // topo sort the marked nodes 
        var sorted = [];

        // execute the nodes in order
        sorted.forEach((x) => x.eval());
    }

    private lookup( id : string ) : Node {
        return this.dict[ id ];
    }

    private replace( old : Node, rep : Node) {
        rep.outputs = old.outputs;
        rep.inputs = old.inputs;
    
        // TODO update the dependents, antecedents with the new node
    }

    visitDoubleNode(node : ast.DoubleNode) : Node {
        return new Node( () => node.value ); 
    }
    
    visitStatementListNode(node : ast.StatementListNode) : Node {
        var n,s,sl = node;
        while (sl){
            s = sl.s;
            if ( !s ) break;
            n = s.accept( this );
            sl = sl.sl;
        } 
        return n;
    }

    visitAssignmentNode(node : ast.AssignmentNode) : Node {
        var id = node.id.id;
        var n = node.e.accept( this );
        
        var old = this.lookup(id);
        if (old) this.replace( old, n );

        // we need the dependencies of the lhs to know about the new rhs
                


        // iterate through all nodes

        

        return n;
    }

    visitIdentifierNode(node : ast.IdentifierNode) : Node {
        return this.dict[node.id];  
    }

    // FunctionCall
    // Assignment

    visitIdentifierListNode(node : ast.IdentifierListNode) : Node { return null; }
    visitTypedIdentifierNode(node : ast.TypedIdentifierNode) : Node { return null; }
    visitIntNode(node : ast.IntNode) : Node { return null; }
    visitBooleanNode(node : ast.BooleanNode) : Node { return null; }
    visitStringNode(node : ast.StringNode) : Node { return null; }
    visitArrayNode(node : ast.ArrayNode) : Node { return null; }
    visitBinaryExpressionNode(node : ast.BinaryExpressionNode) : Node { return null; }
    visitFunctionCallNode(node : ast.FunctionCallNode) : Node { return null; }
    visitArrayIndexNode(node : ast.ArrayIndexNode) : Node { return null; }
    visitExpressionListNode(node : ast.ExpressionListNode) : Node { return null; }
    visitIfStatementNode(node : ast.IfStatementNode) : Node { return null; }
    visitFunctionDefinitionNode(node : ast.FunctionDefinitionNode) : Node { return null; }
    visitReturnNode(node : ast.ReturnNode) : Node { return null; }
    visitReplicationExpressionNode(node : ast.ReplicationExpressionNode) : Node { return null; }
    visitReplicationGuideNode(node : ast.ReplicationGuideNode) : Node { return null; }
    visitReplicationGuideListNode(node : ast.ReplicationGuideListNode) : Node { return null; }

}

