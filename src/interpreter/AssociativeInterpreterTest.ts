/// <reference path="../../typings/node.d.ts" />
import * as assert from "assert";
import * as Parser from '../Parser';
import * as AST from '../AST';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { AssociativeInterpreter } from './AssociativeInterpreter';

Parser.parser.yy = AST;

function run(p, fds?){
	var pp = Parser.parse( p );

	var i = new AssociativeInterpreter();
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
		TypedFunction.byFunction(
			function(a,b){ return a + b; }, 
			[	new TypedArgument("a", "string"), 
				new TypedArgument("b", "string")]);
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

*/