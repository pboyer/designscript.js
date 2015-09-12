var Parser = require('./Parser')
	, Interpreter = require('./interpreter/AssociativeInterpreter').AssociativeInterpreter
	, TypedFunction = require('./interpreter/RuntimeTypes').TypedFunction
	, TypedArgument = require('./interpreter/RuntimeTypes').TypedArgument
	, ast = require('./AST');
	
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
