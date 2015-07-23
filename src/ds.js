var Parser = require('./parser')
	, Interpreter = require('./interpreter').Interpreter
	, TypedFuncDef = require('./interpreter').TypedFuncDef
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
