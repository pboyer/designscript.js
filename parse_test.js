var ds = require('./parse')
	, assert = require('assert');

var ast = require('./ast');
ds.parser.yy = ast;

(function(){
	assert.ok( ds.parse('a = 4;').s instanceof ast.AssignStmt );	
	assert.ok( ds.parse('def x(a, b){ return = 4; };').s instanceof ast.FuncDefStmt );
	assert.ok( ds.parse('if (a) { return = b; };').s instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else {};').s instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else { a = stuff; };').s instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else if (b) { a = stuff; };').s instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('a = {1,2,3};').s.e instanceof ast.ArrayNode );
	assert.ok( ds.parse('a = {1,2,3}; b = a[1 + 1];').sl.s.e instanceof ast.ArrayIndexNode );
	assert.ok( ds.parse('a = "ok";').s.e instanceof ast.StringNode );

	assert.ok( ds.parse('a = foo(b<1>);').s.e instanceof ast.FunctionCallNode );
	assert.ok( ds.parse('a = foo(a<1>,b<2>);').s.e instanceof ast.FunctionCallNode );

	assert.throws( function(){ ds.parse('4;')} );
})();

