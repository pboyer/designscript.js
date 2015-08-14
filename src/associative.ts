import visitor = require('./visitor');
import ast = require('./ast');
import enviro = require('./environment');
import imperative = require('./imperative');
import range = require('./range');
import types = require('./types');

export class AssociativeInterpreter implements visitor.Visitor<DependencyNode> {

    env : enviro.Environment = new enviro.Environment();

    run( sl : ast.StatementListNode ) : DependencyNode {
        return sl.accept( this );
    }

    set( id : string, n : DependencyNode ) {
        this.env.set( id, n );
    }

    lookup( id : string ) : DependencyNode {
        return this.env.lookup( id );
    }

    visitNumberNode(node : ast.NumberNode) : DependencyNode { 
        var n = new DependencyNode( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitBooleanNode(node : ast.BooleanNode) : DependencyNode { 
        var n = new DependencyNode( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitStringNode(node : ast.StringNode) : DependencyNode { 
        var n = new DependencyNode( () => node.value ); 
        n.eval();
        return n;
    }
    
    visitStatementListNode(node : ast.StatementListNode) : DependencyNode {
        var n,s,sl = node;
        while (sl){
            s = sl.head;
            if ( !s ) break;
            n = s.accept( this );
            sl = sl.tail;
        } 
        return n;
    }

    visitAssignmentNode(node : ast.AssignmentNode) : DependencyNode {
        var id = node.identifier.name;
        var n = node.expression.accept( this );
       
        if (this.env.contains( id )) 
            replace( this.lookup( id ), n ); 
        
        this.set( id, n );
        resolve( n );  

        return n;
    }

    visitIdentifierNode(node : ast.IdentifierNode) : DependencyNode {
        var n = this.lookup( node.name );  
        if (!n) throw new Error("Unbound identifier: " + node.name);
        return n;
    }

    visitBinaryExpressionNode(node : ast.BinaryExpressionNode) : DependencyNode {
        var n : DependencyNode = getBinaryExpressionNode( node.operator );
        
        connect( node.firstExpression.accept( this ), n, 0 ); 
        connect( node.secondExpression.accept( this ), n, 1 ); 

        return n;
    }

    visitArrayIndexNode(node : ast.ArrayIndexNode) : DependencyNode { 
        var n = new DependencyNode((a,i) => a[i]);
        var a = node.array.accept( this );    
        var i = node.index.accept( this ); 
        connect( a, n, 0 );   
        connect( i, n, 1 );
        n.eval();
        return n;
    }
    
    visitArrayNode(node : ast.ArrayNode) : DependencyNode { 
        var n = new DependencyNode(function(){ return Array.prototype.slice.call(arguments, 0); });
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

    visitImperativeBlockNode(node : ast.ImperativeBlockNode) : DependencyNode { 
        var n = new DependencyNode( () => {
            var i = new imperative.ImperativeInterpreter();
            return i.run(node.statementList);
        });
        n.eval();
        return n;
    };
    
    visitAssociativeBlockNode(node : ast.AssociativeBlockNode) : DependencyNode { 
        var n = new DependencyNode( () => {
            var i = new AssociativeInterpreter();
            return i.run(node.statementList).value;
        });
        n.eval();
        return n;
    };
    
    visitRangeExpressionNode(node : ast.RangeExpressionNode) : DependencyNode { 
        
        var start = node.start.accept( this );
        var end = node.end.accept( this );
        
        if (!node.step){
            var n = new DependencyNode(range.Range.byStartEnd);
            connect( start, n, 0 );
            connect( end, n, 1 );
            n.eval();
            return n;
        }
            
        var step = node.step.accept( this );
        var f = node.isStepCount ? range.Range.byStepCount : range.Range.byStepSize;
        
        var n = new DependencyNode(f);
        connect( start, n, 0 );
        connect( end, n, 1 );
        connect( step, n, 2 );
        
        n.eval();
        return n;
    };
    
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
    
    visitFunctionDefinitionNode(fds : ast.FunctionDefinitionNode) : DependencyNode { 
         
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
        
        return null; 
    }

    visitFunctionCallNode(node : ast.FunctionCallNode) : DependencyNode { 
        var f = this.lookup(node.functionId.name);
        
        if (!(f instanceof types.TypedFunction)){
            throw new Error(node.functionId.name + " is not a function!");
        }

        var n = new DependencyNode(function(){ return this.replicator.replicate(f, arguments ); });
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

    visitReplicationExpressionNode(node : ast.ReplicationExpressionNode) : DependencyNode { 
         throw new Error("Not implemented");
    }
    
    
    // visitFunctionCallNode(e: ast.FunctionCallNode): any {
    //     var fd = this.lookup(e.functionId.name);
    //     return this.replicator.replicate(fd, e.arguments.accept(this));
    // }

    // visitReplicationExpressionNode(fa: ast.ReplicationExpressionNode): any {
    //     return new types.ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList.accept(this))
    // }
   
    // visitReplicationGuideListNode(rl: ast.ReplicationGuideListNode): number[] {
    //     var vs = [];
    //     while (rl != undefined) {
    //         vs.push(rl.head.accept(this));
    //         rl = rl.tail;
    //     }
    //     return vs;
    // }
    
    visitReplicationGuideNode(node : ast.ReplicationGuideNode) : DependencyNode { throw new Error("Not implemented"); }
    visitReplicationGuideListNode(node : ast.ReplicationGuideListNode) : DependencyNode { throw new Error("Not implemented"); }
    
    visitIdentifierListNode(node : ast.IdentifierListNode) : DependencyNode { throw new Error("Not implemented"); }
    visitExpressionListNode(node : ast.ExpressionListNode) : DependencyNode { throw new Error("Not implemented"); }
    visitIfStatementNode(node : ast.IfStatementNode) : DependencyNode { throw new Error("Not implemented"); }

    
}

export class DependencyNode {
    private static gid : number = 0;
    
    id : number = DependencyNode.gid++;
    dirty : boolean = true;
    inputs : DependencyNode[] = [];
    outputs : DependencyNode[] = [];
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

function resolve( node : DependencyNode ){
    // mark the nodes
    var marked = new Array<DependencyNode>(), remaining = [ node ];
    while (remaining.length){
        var n = remaining.pop();
        n.dirty = true;
        n.outputs.forEach((x) => remaining.push(x));
        marked.push(n);
    }

    // topo sort
    var roots = marked.filter((x) => x.inputs.reduce((a, y) => !y.dirty && a, true));
    var sorted = new Array<DependencyNode>();        
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

function replace( old : DependencyNode, rep : DependencyNode) {
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

function connect( s : DependencyNode, e : DependencyNode, i : number ){
    if (s === e) throw new Error("Cannot connect a node to itself");
    
    s.outputs.push( e );
    e.inputs[i] = s;
}

function disconnect( s : DependencyNode, e : DependencyNode, i : number ){
    var i = s.outputs.indexOf(e)
    s.outputs.splice(i, 1);

    e.inputs[i] = null;
}

function getBinaryExpressionNode( type : string ) : DependencyNode {
    switch( type ){
        case "+":
            return new DependencyNode( (a, b) => a + b );
        case "-":
            return new DependencyNode( (a, b) => a - b );
        case "*":
            return new DependencyNode( (a, b) => a * b );
        case "<":
            return new DependencyNode( (a, b) => a < b );
        case "||":
            return new DependencyNode( (a, b) => a || b );
        case "==":
            return new DependencyNode( (a, b) => a === b );
        case ">":
            return new DependencyNode( (a, b) => a > b );
    }

    throw new Error( "Unknown binary operator type" );
}
