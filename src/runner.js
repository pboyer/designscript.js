var fs = require('fs')
    , Parser = require('./parser')
	, assert = require('assert')
	, Interpreter = require('./imperative').Interpreter
	, TypedFuncDef = require('./imperative').TypedFuncDef
	, FuncArgExpr = require('./ast').FuncArgExpr;

var ast = require('./ast');
Parser.parser.yy = ast;

function run(p){
    (new Interpreter()).run( Parser.parse( p ) );
}

var fn = process.argv[2];

fs.readFile(fn, 'utf8', function (err, contents) {
    if (err) {
        return console.log(err);
    }

    run( contents );    
});
