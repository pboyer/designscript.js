var fs = require('fs')
    , Parser = require('./parser')
	, assert = require('assert')
	, Interpreter = require('./interpreter').Interpreter
	, TypedFuncDef = require('./interpreter').TypedFuncDef
	, FuncArgExpr = require('./ast').FuncArgExpr;

var ast = require('./ast');
Parser.parser.yy = ast;

function eval(p){
    (new Interpreter()).eval( Parser.parse( p ) );
}

var fn = process.argv[2];

fs.readFile(fn, 'utf8', function (err, contents) {
    if (err) {
        return console.log(err);
    }

    eval( contents );    
});
