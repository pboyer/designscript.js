import visitor = require('./visitor');
import ast = require('./ast');
import enviro = require('./environment');

export class Node {
    private static gid : number = 0;
    
    id : number = Node.gid++;
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
        this.dirty = false;
    }
}

function resolve( node : Node ){
    // mark the nodes
    var marked = new Array<Node>(), remaining = [ node ];
    while (remaining.length){
        var n = remaining.pop();
        n.dirty = true;
        n.outputs.forEach((x) => remaining.push(x));
        marked.push(n);
    }

    // topo sort
    var roots = marked.filter((x) => x.inputs.reduce((a, y) => !y.dirty && a, true));
    var sorted = new Array<Node>();        
    var visited = {};

    while( roots.length ){
        var n = roots.pop();
        visited[ n.id ] = n;
        sorted.push( n );

        n.outputs.forEach( (o) => {
            var isRoot = o.inputs.reduce((a, y) => (visited[ y.id ] || !y.dirty) && a, true);
            if (isRoot) roots.push( o );
        });
    }

    // execute the nodes in order
    sorted.forEach((x) => x.eval());
}

function replace( old : Node, rep : Node) {
    rep.outputs = old.outputs;
    rep.inputs = old.inputs;

    rep.outputs.forEach((x) => 
            {
                var i = x.inputs.indexOf( old );
                x.inputs[ i ] = rep;
            });

    rep.inputs.forEach((x) =>
            {
                var i = x.outputs.indexOf( old );
                x.outputs.splice(i, 1);
            });
}

function connect( s : Node, e : Node, i : number ){
    if (s === e) throw new Error("Cannot connect a node to itself");
    
    s.outputs.push( e );
    e.inputs[i] = s;
}

function disconnect( s : Node, e : Node, i : number ){
    var i = s.outputs.indexOf(e)
    s.outputs.splice(i, 1);

    e.inputs[i] = null;
}

function getBinaryExpressionNode( type : string ) : Node {
    switch( type ){
        case "+":
            return new Node( (a, b) => a + b );
        case "-":
            return new Node( (a, b) => a - b );
        case "*":
            return new Node( (a, b) => a * b );
        case "<":
            return new Node( (a, b) => a < b );
        case "||":
            return new Node( (a, b) => a || b );
        case "==":
            return new Node( (a, b) => a === b );
        case ">":
            return new Node( (a, b) => a > b );
    }

    throw new Error( "Unknown binary operator type" );
}

export class Interpreter implements visitor.Visitor<Node> {

    env : enviro.Environment = new enviro.Environment();
    fds : { [ id : string ] : (...any) => any; } = {};

    run( sl : ast.StatementListNode ){
        sl.accept( this );
    }

    private set( id : string, n : Node ) {
        this.env.set( id, n );
    }

    private lookup( id : string ) : Node {
        return this.env.lookup( id );
    }

    visitIntNode(node : ast.IntNode) : Node { 
        var n = new Node( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitDoubleNode(node : ast.DoubleNode) : Node {
        var n = new Node( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitBooleanNode(node : ast.BooleanNode) : Node { 
        var n = new Node( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitStringNode(node : ast.StringNode) : Node { 
        var n = new Node( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitStatementListNode(node : ast.StatementListNode) : Node {
        var n,s,sl = node;
        while (sl){
            s = sl.head;
            if ( !s ) break;
            n = s.accept( this );
            sl = sl.tail;
        } 
        return n;
    } 

    visitAssignmentNode(node : ast.AssignmentNode) : Node {
        var id = node.identifier.name;
        var n = node.expression.accept( this );
       
        if (this.env.contains( id )) 
            replace( this.lookup( id ), n ); 
        
        this.set( id, n );
        resolve( n );  

        return n;
    }

    visitIdentifierNode(node : ast.IdentifierNode) : Node {
        var n = this.lookup( node.name );  
        if (!n) throw new Error("Unbound identifier: " + node.name);
        return n;
    }

    visitBinaryExpressionNode(node : ast.BinaryExpressionNode) : Node {
        var n : Node = getBinaryExpressionNode( node.operator );
        
        connect( node.firstExpression.accept( this ), n, 0 ); 
        connect( node.secondExpression.accept( this ), n, 1 ); 

        return n;
    }

    visitFunctionCallNode(node : ast.FunctionCallNode) : Node { 
        var f = this.fds[ node.functionId.name ];
        var n = new Node( f );
        var el = node.arguments;
        var i = 0;
        while (el){
            var e = el.head;
            el = el.tail;
            connect( e.accept(this), n, i++ );
        }
        n.eval();
        return n;
    }

    visitArrayIndexNode(node : ast.ArrayIndexNode) : Node { 
        var n = new Node((a,i) => a[i]);
        var a = node.array.accept( this );    
        var i = node.index.accept( this ); 
        connect( a, n, 0 );   
        connect( i, n, 1 );
        n.eval();
        return n;
    }
    
    visitArrayNode(node : ast.ArrayNode) : Node { 
        var n = new Node(function(){ return Array.prototype.slice.call(arguments, 0); });
        var el = node.expressionList;
        var i = 0;
        while (el){
            var e = el.head;
            var s = e.accept( this );
            connect( s, n, i++ );
            el = el.tail;
        }
        n.eval();
        return n;
    }

    visitIdentifierListNode(node : ast.IdentifierListNode) : Node { throw new Error("Not implemented"); }
    visitTypedIdentifierNode(node : ast.TypedIdentifierNode) : Node { throw new Error("Not implemented"); }
    visitExpressionListNode(node : ast.ExpressionListNode) : Node { throw new Error("Not implemented"); }
    visitIfStatementNode(node : ast.IfStatementNode) : Node { throw new Error("Not implemented"); }
    visitFunctionDefinitionNode(node : ast.FunctionDefinitionNode) : Node { throw new Error("Not implemented"); }
    visitReturnNode(node : ast.ReturnNode) : Node { throw new Error("Not implemented"); }
    visitReplicationExpressionNode(node : ast.ReplicationExpressionNode) : Node { throw new Error("Not implemented"); }
    visitReplicationGuideNode(node : ast.ReplicationGuideNode) : Node { throw new Error("Not implemented"); }
    visitReplicationGuideListNode(node : ast.ReplicationGuideListNode) : Node { throw new Error("Not implemented"); }

}

