var Parser = require('./parse')
	, assert = require('assert')
	, Interpreter = require('./interp').Interpreter
	, TypedFuncDef = require('./interp').TypedFuncDef
	, FuncArgExpr = require('./ast').FuncArgExpr;

var ast = require('./ast');
Parser.parser.yy = ast;

function eval(p){
	var pp = Parser.parse( p );

	// record the debug statements
	var record = [];
	var exts = {
		"debug" : new TypedFuncDef(function(x){ record.push(x); })
	};

	(new Interpreter( exts )).eval( pp );
	
	return record;
}

(function(){
	var r = eval('a = 4; t = debug( a );');
	assert.equal( 4, r[0] ); 	
})();

(function(){
	var r = eval('def foo(a,b){ return = a + b; }; t = debug( foo(1, 2) );');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = eval('def foo(a,b){ return = bar(a,b); }; def bar(a,b){ return = a + b; }; t = debug( foo(1, 2));');
	assert.equal( 3, r[0] );
})();


(function(){
	var r = eval('def firstElement(a : int[]){ return = a[0]; }; t = debug( firstElement({0,1,2}<1>) );');
	assert.equal( 0, r[0] );
})();

(function(){
	var r = eval('def intId(a : int){ return = a; }; t = debug( intId(2) );');
	assert.equal( 2, r[0] );
})();

(function(){
	var r = eval('a : int = 25; t = debug( a );');
	assert.equal( 25, r[0] );
})();

(function(){
	var r = eval('a = {true, false, "Ok cool"}; t = debug( a[1 + 1] );');
	assert.equal( "Ok cool", r[0] );
})();

