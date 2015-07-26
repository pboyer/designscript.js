var Parser = require('./parser')
	, assert = require('assert')
	, Interpreter = require('./interpreter').Interpreter
	, TypedFunctionDefinition = require('./interpreter').TypedFunctionDefinition;

var ast = require('./ast');
Parser.parser.yy = ast;

function eval(p){
	var pp = Parser.parse( p );

	// inject the debugger function
	var record = [];
	var exts = {
		"debug" : new TypedFunctionDefinition(function(x){ 
            record.push(x); 
        })
	};

	(new Interpreter( exts )).eval( pp );
	
	return record;
}

(function(){
	var r = eval('a = 4; print( a );');
})();

(function(){
	var r = eval('a = 4; debug( a );');
	assert.equal( 4, r[0] ); 	
})();

(function(){
	var r = eval('debug( 2 * 3 );');
	assert.equal( 6, r[0] );
})();

(function(){
	var r = eval('debug( true || false );');
	assert.equal( true, r[0] );
})();

(function(){
	var r = eval('debug( 5 > 4 );');
	assert.equal( true, r[0] );
})();

(function(){
	var r = eval('def foo(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = eval('def foo(a,b){ return = bar(a,b); } def bar(a,b){ return = a + b; } debug( foo(1, 2));');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = eval('def firstElement(a : int[]){ return = a[0]; } debug( firstElement({0,1,2}) );');
	assert.equal( 0, r[0] );
})();

(function(){
	var r = eval('def intId(a : int){ return = a; } debug( intId(2) );');
	assert.equal( 2, r[0] );
})();

(function(){
	var r = eval('a : int = 25; debug( a );');
	assert.equal( 25, r[0] );
})();

(function(){
	var r = eval('a = {true, false, "Ok cool"}; debug( a[1 + 1] );');
	assert.equal( "Ok cool", r[0] );
})();

