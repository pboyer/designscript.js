var ds = require('./parse')
	, assert = require('assert');

var ast = require('./ast');
ds.parser.yy = ast;

(function(){
	assert.ok( ds.parse('a = 4;').s instanceof ast.AssignStmt );	
	assert.ok( ds.parse('def x(a, b){ return = 4; };').s instanceof ast.FuncDefStmt );
	assert.ok( ds.parse('if (a) { return = b; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return = b; } else {};').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return = b; } else { a = stuff; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('if (a) { return = b; } else if (b) { a = stuff; };').s instanceof ast.IfStmt ); 
	assert.ok( ds.parse('a = {1,2,3};').s.e instanceof ast.ArrayLit );
	assert.ok( ds.parse('a = {1,2,3}; b = a[1 + 1];').sl.s.e instanceof ast.ArrayIndexExpr );
	assert.ok( ds.parse('a = "ok";').s.e instanceof ast.StringLit );

	assert.ok( ds.parse('a = foo(b<1>);').s.e instanceof ast.ApplyExpr );
	assert.ok( ds.parse('a = foo(a<1>,b<2>);').s.e instanceof ast.ApplyExpr );

	assert.throws( function(){ ds.parse('4;')} );
})();

