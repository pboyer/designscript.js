var Parser = require('./Parser')
	, assert = require('assert')
	, types = require('./RuntimeTypes')
	, Interpreter = require('./AssociativeInterpreter').AssociativeInterpreter;

var ast = require('./ast');
Parser.parser.yy = ast;

function run(p, fds){
	var pp = Parser.parse( p );

	var i = new Interpreter();
	if (fds){
		for (var fid in fds){
			i.env.set(fid, fds[fid]);
		}
	}
    i.run( pp );
	return i;
}

(function(){
    var i = run('a = 4; b = a * 2;');
	assert.equal( 4, i.env.lookup("a").value );
	assert.equal( 8, i.env.lookup("b").value );
})();

(function(){
    var i = run('a = 4; b = a * 2 + 5;');
	assert.equal( 4, i.env.lookup("a").value );
	assert.equal( 13, i.env.lookup("b").value );
})();

(function(){
	var concat = 
		types.TypedFunction.byFunction(
			function(a,b){ return a + b; }, 
			[	new types.TypedArgument("a", "string"), 
				new types.TypedArgument("b", "string")]);
	var fds = { "concat" : concat};
	var i = run('a = "hi"; b = "ho"; w = concat(b,a);', fds);
	assert.equal( "hohi", i.env.lookup("w").value );
})();

(function(){
	var i = run('w = [Imperative]{ return = 8; }');
	assert.equal( 8, i.env.lookup("w").value );
})();

(function(){
	var i = run('w = [Imperative]{ return = [Associative]{ return = 8; }}');
	assert.equal( 8, i.env.lookup("w").value );
})();

(function(){
	var i = run('c = 0..2;');
	assert.deepEqual( [0,1,2], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = 0; b = 2; c = a..b;');
	assert.deepEqual( [0,1,2], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = 0; b = 2; c = a..b..2;');
	assert.deepEqual( [0,2], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = 0; b = 2; c = a..b..#3;');
	assert.deepEqual( [0,1,2], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = {1,2,3}; def foo(b){ return = b; } c = foo(a);');
	assert.deepEqual( [1,2,3], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = {1,2,3}; def foo(b){ return = bar(b); } def bar(b){ return = b; } c = foo(a);');
	assert.deepEqual( [1,2,3], i.env.lookup("c").value );
})();

(function(){
	var i = run('a = {1,2,3}; f = print(a);');
})();

/*
// reassignment
// (function(){
//     var i = run('a = 4; b = {a, a}; a = 3;');
//     assert.equal( 3, i.env.lookup("b").value[0] );
//     assert.equal( 3, i.env.lookup("b").value[1] );
// })();

// (function(){
// 	var fds = { "foo" : function(a,b){ return 2 * a + b; } };
// 	var i = run('a = 4; w = foo( a, a ); a = 3;', fds);
// 	assert.equal( 9, i.env.lookup("w").value );
// })();


(function(){
	var r = run('debug( 2 * 3 );');
	assert.equal( 6, r[0] );
})();

(function(){
	var r = run('debug( true || false );');
	assert.equal( true, r[0] );
})();

// (function(){
// 	var r = run('debug( 5 > 4 );');
// 	assert.equal( true, r[0] );
// })();

(function(){
	var r = run('def foo(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = run('def foo(a,b){ return = bar(a,b); } def bar(a,b){ return = a + b; } debug( foo(1, 2));');
	assert.equal( 3, r[0] );
})();

(function(){
	var r = run('def firstElement(a : int[]){ return = a[0]; } debug( firstElement({0,1,2}) );');
	assert.equal( 0, r[0] );
})();

(function(){
	var r = run('def intId(a : int){ return = a; } debug( intId(2) );');
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

*/
