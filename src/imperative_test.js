var Parser = require('./parser')
	, assert = require('assert')
	, Interpreter = require('./imperative').Interpreter
	, TypedFunction = require('./types').TypedFunction
	, TypedArgument = require('./types').TypedArgument;

var ast = require('./ast');
Parser.parser.yy = ast;

function run(p){
	var pp = Parser.parse( p );

	// inject the debugger function
	var record = [];
	var exts = {
		"debug" : new TypedFunction(function(x){  record.push(x); }, 
						[ new TypedArgument("arg") ], "debug")
	};

	(new Interpreter( exts )).run( pp );
	
	return record;
}

(function(){
	var r = run('a = 4; print( a );');
})();

(function(){
	var r = run('a = 4; debug( a );');
	assert.equal( 4, r[0] ); 	
})();

(function(){
	var r = run('debug( 2 * 3 );');
	assert.equal( 6, r[0] );
})();

(function(){
	var r = run('debug( true || false );');
	assert.equal( true, r[0] );
})();

(function(){
	var r = run('debug( 5 > 4 );');
	assert.equal( true, r[0] );
})();

(function(){
	var r = run('def foo(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = run('def foo(a,b){ return = bar(a,b); } def bar(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = run('def firstElement(a : number[]){ return = a[0]; } debug( firstElement({0,1,2}) );');
	assert.equal( 0, r[0] );
})();

(function(){
	var r = run('def intId(a : number){ return = a; } debug( intId(2) );');
	assert.equal( 2, r[0] );
})();

(function(){
	var r = run('a : int = 25; debug( a );');
	assert.equal( 25, r[0] );
})();

(function(){
	var r = run('a = {true, false, "Ok cool"}; debug( a[1 + 1] );');
	assert.equal( "Ok cool", r[0] );
})();

