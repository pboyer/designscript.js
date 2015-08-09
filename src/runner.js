var fs = require('fs')
    , Parser = require('./parser')
	, Interpreter = require('./associative').AssociativeInterpreter;

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
