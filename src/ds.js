var Parser = require('./parser')
	, Interpreter = require('./imperative').Interpreter
	, TypedFuncDef = require('./imperative').TypedFuncDef
	, FuncArgExpr = require('./ast').FuncArgExpr;

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
    TypedFuncDef : TypedFuncDef,
    run : run
}
