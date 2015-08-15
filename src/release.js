var Parser = require('./Parser')
	, Interpreter = require('./AssociativeInterpreter').AssociativeInterpreter
	, TypedFunction = require('./Types').TypedFunction
	, TypedArgument = require('./Types').TypedArgument;

var ast = require('./AST');
Parser.parser.yy = ast;

function run(p){
	var pp = Parser.parse( p );
	(new Interpreter()).eval( pp );
}

module.exports = 
{
    Parser : Parser.parser,
    Interpreter : Interpreter,
    TypedFunction : TypedFunction,
    TypedArgument : TypedArgument,
    run : run
};
