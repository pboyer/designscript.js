/// <reference path="../../typings/node.d.ts" />
import * as assert from "assert";
import * as Parser from '../Parser';
import * as AST from '../AST';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { ImperativeInterpreter } from './ImperativeInterpreter';

Parser.parser.yy = AST;

function run(p) {
	var pp = Parser.parse(p);

	var i = new ImperativeInterpreter();
	
	// inject the debug function
	var record = [];
	var debug = new TypedFunction(function (x) { record.push(x); }, [new TypedArgument("arg")], "debug");
	i.env.set("debug", debug);

	i.run(pp);

	return record;
}

function interpret(p) {
	var pp = Parser.parse(p);

	var i = new ImperativeInterpreter();
	i.run(pp);

	return i;
}

(function () {
	var r = run('a = 4; print( a );');
})();

(function () {
	var r = run('a = 4; debug( a );');
	assert.equal(4, r[0]);
})();

(function () {
	var r = run('debug( 2 * 3 );');
	assert.equal(6, r[0]);
})();

(function () {
	var r = run('debug( true || false );');
	assert.equal(true, r[0]);
})();

(function () {
	var r = run('debug( 5 > 4 );');
	assert.equal(true, r[0]);
})();

(function () {
	var r = run('def foo(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal(3, r[0]);
})();

(function () {
	var r = run('def foo(a,b){ return = bar(a,b); } def bar(a,b){ return = a + b; } debug( foo(1, 2) );');
	assert.equal(3, r[0]);
})();

(function () {
	var r = run('def firstElement(a : number[]){ return = a[0]; } debug( firstElement({0,1,2}) );');
	assert.equal(0, r[0]);
})();

(function () {
	var r = run('def intId(a : number){ return = a; } debug( intId(2) );');
	assert.equal(2, r[0]);
})();

(function () {
	var r = run('a : number = 25; debug( a );');
	assert.equal(25, r[0]);
})();

(function () {
	var r = run('a = {true, false, "Ok cool"}; debug( a[1 + 1] );');
	assert.equal("Ok cool", r[0]);
})();

(function () {
	var i = interpret('c = 0..2;');
	assert.deepEqual([0, 1, 2], i.env.lookup("c"));
})();

(function () {
	var i = interpret('a = 0; b = 2; c = a..b;');
	assert.deepEqual([0, 1, 2], i.env.lookup("c"));
})();

(function () {
	var i = interpret('a = 0; b = 2; c = a..b..2;');
	assert.deepEqual([0, 2], i.env.lookup("c"));
})();

(function () {
	var i = interpret('a = 0; b = 2; c = a..b..#3;');
	assert.deepEqual([0, 1, 2], i.env.lookup("c"));
})();

(function () {
	var i = interpret('a = 0; b = 2; c = a..b..2;');
	assert.deepEqual([0, 2], i.env.lookup("c"));
})();

(function () {
	var i = interpret('def add1(a : number){ return = a + 1; } c = 0..5; d = add1(c); ');
	assert.deepEqual([1, 2, 3, 4, 5, 6], i.env.lookup("d"));
})();

(function () {
	var i = interpret('def add1(a : number){ return = a + 1; } c = 0..5; d = add1(c<1>); ');
	assert.deepEqual([1, 2, 3, 4, 5, 6], i.env.lookup("d"));
})();

(function () {
	assert.throws(function () { interpret('def add1(a : number){ return = a + 1; } c = 0..5; d = add1(c<2>); ') })
})();