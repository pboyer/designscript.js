var ds = require('./parse')
	, assert = require('assert');

var ast = require('./ast');
ds.parser.yy = ast;

(function(){
	assert.ok( ds.parse('var a = 4;').s instanceof ast.AssignStmt );
	assert.ok( ds.parse('4;').s instanceof ast.IntLit );
	assert.ok( ds.parse('func x(a, b){ return 4; };').s instanceof ast.FuncDefStmt );
	assert.ok( ds.parse('if (a) { return b; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else {};').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else { stuff; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return b; } else if (b) { stuff; };').s instanceof ast.IfStmt ); 
})();

