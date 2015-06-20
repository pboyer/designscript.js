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

/*	assert.ok( ds.parse('4;').s instanceof ast.IntLit );
	assert.ok( ds.parse('func x(a, b){ return 4; };').s instanceof ast.FuncDefStmt );
	assert.ok( ds.parse('if (a) { return b; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else {};').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else { stuff; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else if (b) { stuff; };').s instanceof ast.IfStmt ); */ 
})();

