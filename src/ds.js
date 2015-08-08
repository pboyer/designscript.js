var Parser = require('./parser')
	, Interpreter = require('./associative').AssociativeInterpreter
	, TypedFunction = require('./types').TypedFunction
	, TypedArgument = require('./types').TypedArgument;

var ast = require('./ast');
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
