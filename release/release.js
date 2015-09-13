var Parser = require('../src/Parser')
	, Interpreter = require('../src/interpreter/AssociativeInterpreter').AssociativeInterpreter
	, TypedFunction = require('../src/interpreter/RuntimeTypes').TypedFunction
	, TypedArgument = require('../src/interpreter/RuntimeTypes').TypedArgument
	, ast = require('../src/AST');
	
Parser.parser.yy = ast;

function run(p){
	var pp = Parser.parse( p );
	(new Interpreter()).run( pp );
}

module.exports = 
{
    AST : ast,
    Parser : Parser.parser,
    Interpreter : Interpreter,
    TypedFunction : TypedFunction,
    TypedArgument : TypedArgument,
    run : run
};