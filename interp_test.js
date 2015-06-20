var Parser = require('./parse')
	, assert = require('assert')
	, Interpreter = require('./interp').Interpreter;

var ast = require('./ast');
Parser.parser.yy = ast;

function eval(p){
	var pp = Parser.parse( p );
	return (new Interpreter()).eval( pp );
}

(function(){
	eval('var a = 4; print(a);');
	eval('def foo(a,b){ return a + b; }; print( foo(1, 2) );');
	eval('def foo(a,b){ return bar(a,b); }; def bar(a,b){ return a + b; }; print( foo(1, 2));');
})();

