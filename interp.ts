import enviro = require('./env');
import ast = require('./ast');

export class Interpreter {
   
    exts : { [id : string] : TypedFuncDef; };

    constructor(exts){
        this.exts = exts;
    }

    eval( sl : ast.StmtList ) : void {
        var globals = builtins( this.exts );

        evalFuncDefStmts( sl, globals ); 				
        evalStmtList( sl, globals );
    }
}

function builtins(exts : { [id : string] : any }) : enviro.Env {
    var e : enviro.Env = new enviro.Env();

    if (exts){
        for (var id in exts){
            e.set( id, exts[id] );
        }
    }
    
    e.set("print", new TypedFuncDef( console.log ));
    return e;
}

function evalFuncDefStmts( sl : ast.StmtList, env : enviro.Env ) : void {
    var r, s;
    while ( sl != undefined ){
        s = sl.s;
        sl = sl.sl;
        if ( s instanceof ast.FuncDefStmt ) 
            evalFuncDefStmt( s, env );
    }
}

function evalStmtList( sl : ast.StmtList, env : enviro.Env ) : void {
    var r, s;
    while ( sl != undefined ){
        s = sl.s;
        sl = sl.sl;
        if ( !(s instanceof ast.FuncDefStmt)) 
            r = evalStmt( s, env );
    }
    
    return r;
}

function evalExpr( e : ast.AssociativeNode, env : enviro.Env ) : any {
    if ( e instanceof ast.BinaryExpressionNode ){
        return evalBinaryExpressionNode( e, env );
    } else if ( e instanceof ast.FunctionCallNode ){
        return evalFunctionCallNode( e, env );
    } else if ( e instanceof ast.IdentifierNode ){
        return evalIdentifierNode(e, env);
    } else if ( e instanceof ast.IntNode ){
        return evalIntNode( e );	
    } else if ( e instanceof ast.DoubleNode ){
        return evalDoubleNode( e );
    } else if ( e instanceof ast.BooleanNode ){
        return evalBooleanNode( e );
    } else if ( e instanceof ast.StringNode ){
        return evalStringNode( e );
    } else if ( e instanceof ast.ArrayNode ){
        return evalArrayNode( e, env );
    } else if ( e instanceof ast.ArrayIndexNode ){
        return evalArrayIndexNode( e, env );
    }

    throw new Error("Unknown expression type");
}

function evalArrayIndexNode( e : ast.ArrayIndexNode, env : enviro.Env ) : any {
    var array = evalExpr( e.a, env );
    var index = evalExpr( e.i, env );
    return array[index];
}

function evalArrayNode( e : ast.ArrayNode, env : enviro.Env ) : any[] {
    return evalExprListNode( e.el, env );	
}

function evalStringNode( e : ast.StringNode ) : string {
    return e.value;
}

function evalBooleanNode( e : ast.BooleanNode ) : boolean {
    return e.value; 
}

function evalDoubleNode( e : ast.DoubleNode ) : Number {
    return e.value;
}	

function evalIntNode( e : ast.IntNode ) : Number {
    return e.value; 
}

function evalIdentifierNode( e : ast.IdentifierNode, env : enviro.Env ) : any {
    return env.lookup( e.id );
}

function evalBinaryExpressionNode( e : ast.BinaryExpressionNode, env : enviro.Env ) : any {
    switch( e.op ){
        case "+":
            return evalExpr( e.lhs, env ) + evalExpr( e.rhs, env );
        case "-":
            return evalExpr( e.lhs, env ) - evalExpr( e.rhs, env );
    }

    throw new Error( "Unknown binary operator type" );
}

function evalStmt( s : ast.Stmt, env : enviro.Env ) : any {
    if ( s instanceof ast.FuncDefStmt){
        return evalFuncDefStmt( s, env );
    } else if ( s instanceof ast.AssignStmt ) {
        return evalAssignStmt( s, env );
    } else if ( s instanceof ast.ReturnStmt ){
        return evalReturnStmt( s, env ); 	
    } else if ( s instanceof ast.IfStatementNode ){
        return evalIfStatementNode( s, env );	
    }

    throw new Error("No clause for statement");
}

function evalReturnStmt( s : ast.ReturnStmt, env : enviro.Env ){
    return evalExpr( s.e, env );
}

function evalIfStatementNode( s : ast.IfStatementNode, env : enviro.Env ){
    var test = evalExpr( s.test, env );
    if (test === true){
        return evalBlockStmt( s.tsl, env );  
    } else {	
        return evalStmt( s.fsl, env );
    }	
}

function evalBlockStmt( sl : ast.StmtList, env : enviro.Env ) : any {	
    return evalStmtList( sl, new enviro.Env( env ) );
}

function evalFunctionCallNode( e : ast.FunctionCallNode, env : enviro.Env ) : any {
    var fd = env.lookup( e.fid.id );
    return replicate( fd, evalFuncArgExprListNode( e.el, env ) );  
}

export class ReplicatedFuncArg {
    v : any;
    rg : Number;

    constructor ( v : any, rg : Number ){
        this.v = v;
        this.rg = rg;
    }
}

function evalFuncArgExprListNode( fal : ast.FuncArgExprList, env : enviro.Env ){
    // each argument has an expression and also a rep guide
    var vs = [];
    while ( fal != undefined ){
        vs.push( new ReplicatedFuncArg( evalExpr(fal.fa.e, env), fal.fa.ri) );
        fal = fal.fal;	
    }
    return vs; 
}
 
function evalExprListNode( el : ast.ExprListNode, env : enviro.Env ) : any[] {
    var vs = [];
    while (el != undefined){
        vs.push( evalExpr( el.e, env ));
        el = el.el;
    }

    return vs;
}

function evalAssignStmt( s : ast.AssignStmt, env : enviro.Env ){
    env.set( s.id.id, evalExpr( s.e, env ));
}

export class TypedFuncDef {
    f : (any) => any;
    al : ast.IdentifierNode[]; 
    
    constructor( f : (any) => any, al : ast.IdentifierNode[] = []){
        this.f = f;
        this.al = al; // the type identifiers for the func def
    }
}

function evalFuncDefStmt( fds : ast.FuncDefStmt, env : enviro.Env ){

    // unpack the argument list 
    var il = fds.il;
    var val = [];
    while (il != undefined){
        val.push( il.id );
        il = il.il;
    }

    var fd; 

    function f(){
        var args = Array.prototype.slice.call( arguments );
        return apply( fds, env, args ); 
    }

    fd = new TypedFuncDef(f, val); 

    env.set(fds.id.id, fd);
}

function apply( fd : ast.FuncDefStmt, env : enviro.Env, args : any[] ) : any {	

    // bind the arguments in the scope 
    var i = 0;
    var il = fd.il;
    while( il != null){
        env.set( il.id.id, args[i++] );
        il = il.il;
    };

    return evalStmtList( fd.sl, env );	
}

function replicate( fd : TypedFuncDef, args : any[] ) : any {
       
    // if all types match, simply execute
    return fd.f.apply(undefined, args.map(function(x){ return x.v; }));

    /*
     *
    // form the indices of all arguments
    var ri = (new Array(fd.al.length))
        .map(function(){ return []; });

    args.forEach(function(x,i){ if (x.rg === undefined) ri[0].push(i); else ri[i-1].push(i); })

    var nrg = ri.length; // num rep guides, if none supplied, we have just one
    var lrf = []; // the shortest array in the replication guide
    var finalArgs = new Array( lrf[0] ); // a structured array representing the final arguments to apply to the function
    var numFuncArgs = 1; // number of arguments to the function
    var i, j, k, l;

    // if all of the arguments match their expected types, execute
    // otherwise, we must divide all of the non-matching fields and recurse

    // for every replication guide
    for (i = 0; i < nrg; i++){
        
        // for every element in the argument array for this replication guide
        for (j = 0; j < lrf[i]; j++){

            // for every element already in the current argument array
            for (k = 0; k < finalArgs.length; k++){

                // initialize the arguments for this invocation or obtain from finalArgs
                targs = i === 0 ? new Array(numFuncArgs) : finalArgs[ k ];

                // for every index in the replication guide
                for (l = 0; l < ri[i]; l++){
                    targs[ ri[i][l] ] = args[l][j]; // one function argument		
                }
            }
        }
    }

    return finalArgs.map(function(x){
        return fd.f.apply( null, x );
    });
*/
}

