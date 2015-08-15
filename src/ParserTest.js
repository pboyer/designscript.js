var ds = require('./Parser')
	, assert = require('assert');

var ast = require('./AST');
ds.parser.yy = ast;

(function(){
    assert.ok( ds.parse('w = [Imperative]{ return = 4; }').head.expression instanceof ast.ImperativeBlockNode );	
	assert.ok( ds.parse('w = [Associative]{ return = 4; }').head.expression instanceof ast.AssociativeBlockNode );	
	assert.ok( ds.parse('a = 4;').head instanceof ast.AssignmentNode );	
	assert.ok( ds.parse('def x(a, b){ return = 4; }').head instanceof ast.FunctionDefinitionNode );
	assert.ok( ds.parse('if (a) { return = b; }').head instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else {}').head instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else { a = stuff; }').head instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('if (a) { return = b; } else if (b) { a = stuff; }').head instanceof ast.IfStatementNode ); 
	assert.ok( ds.parse('a = {1,2,3};').head.expression instanceof ast.ArrayNode );
	assert.ok( ds.parse('a = {1,2,3}; b = a[1 + 1];').tail.head.expression instanceof ast.ArrayIndexNode );
	assert.ok( ds.parse('a = "ok";').head.expression instanceof ast.StringNode );
	assert.ok( ds.parse('a = foo(b<1>);').head.expression instanceof ast.FunctionCallNode );
	assert.ok( ds.parse('a = foo(a<1>,b<2>);').head.expression instanceof ast.FunctionCallNode );
	assert.ok( ds.parse('foo(4);').head instanceof ast.FunctionCallNode );
	
	assert.throws( function(){ ds.parse('4;')} );
})();

