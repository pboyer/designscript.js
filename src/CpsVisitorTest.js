var Parser = require('./Parser')
	, assert = require('assert')
	, types = require('./RuntimeTypes')
	, Interpreter = require('./CpsVisitor').CpsInterpreter;

var ast = require('./ast');
Parser.parser.yy = ast;

function run(p, fds){
	var pp = Parser.parse( p );

	var i = new Interpreter();
	
	if (fds){
		for (var fid in fds){
			i.set(fid, fds[fid]);
		}
	}
    i.visitStatementListNode( pp, function(){ console.log("DONE"); } );
	return i;
}

(function(){
    var i = run('a = 4; b = a * 2;');
	console.log(i.env);
})();

(function(){
    var i = run('a = 4; b = a * 2 + 5;');
	console.log(i.env);
})();
