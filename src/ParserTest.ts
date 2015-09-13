/// <reference path="../typings/node.d.ts" />
import * as assert from "assert";
import * as Parser from './Parser';
import * as AST from './AST';

Parser.parser.yy = AST;

assert.ok( Parser.parse('w = [Imperative]{ return = 4; }').head.expression instanceof AST.ImperativeBlockNode );	
assert.ok( Parser.parse('w = [Associative]{ return = 4; }').head.expression instanceof AST.AssociativeBlockNode );	
assert.ok( Parser.parse('a = 4;').head instanceof AST.AssignmentNode );	
assert.ok( Parser.parse('def x(a, b){ return = 4; }').head instanceof AST.FunctionDefinitionNode );
assert.ok( Parser.parse('if (a) { return = b; }').head instanceof AST.IfStatementNode ); 
assert.ok( Parser.parse('if (a) { return = b; } else {}').head instanceof AST.IfStatementNode ); 
assert.ok( Parser.parse('if (a) { return = b; } else { a = stuff; }').head instanceof AST.IfStatementNode ); 
assert.ok( Parser.parse('if (a) { return = b; } else if (b) { a = stuff; }').head instanceof AST.IfStatementNode ); 
assert.ok( Parser.parse('a = {1,2,3};').head.expression instanceof AST.ArrayNode );
assert.ok( Parser.parse('a = {1,2,3}; b = a[1 + 1];').tail.head.expression instanceof AST.ArrayIndexNode );
assert.ok( Parser.parse('a = "ok";').head.expression instanceof AST.StringNode );
assert.ok( Parser.parse('a = foo(b<1>);').head.expression instanceof AST.FunctionCallNode );
assert.ok( Parser.parse('a = foo(a<1>,b<2>);').head.expression instanceof AST.FunctionCallNode );
assert.ok( Parser.parse('foo(4);').head instanceof AST.FunctionCallNode );

assert.throws( function(){ Parser.parse('4;')} );