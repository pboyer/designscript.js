var ds = require('./parse')
	, ast = require('./ast');

(function(interp){
	
	//
	// Environment
	//
	function Env( outer ){
		this.dict = {};
		this.outer = outer; 
	}

	Env.prototype.lookup = function(id){
		if (this.dict[id] != undefined) return this.dict[id];
		if (this.outer != undefined) return this.outer.lookup(id);
		throw new Error("Unbound identifier!");
	}
	
	Env.prototype.set = function(id, val){
		this.dict[id] = val;
	}

	//
	// Interpreter
	//

	interp = function Interpreter(){};

	interp.eval = function( sl ){
		var env = new Env();
		
		return interpStmtList( s, env );
	};

	function interpStmtList( sl, env ){

		while ( sl != undefined ){
			// what if its a conditional statement
		}

	}

	function interpStmt( s, env ){
		if ( s instanceof ast.FuncDefStmt){
			return interpFuncDefStmt( s, env );
		} else if ( s instanceof ast.AssignStmt ){
			return interpAssignStmt( s, env );
		} else if ( s instanceof ast.ReturnStmt ){
			return interpReturnStmt( s, env );
		} 

		throw new Error("No clause for statement");
	}

	function interpFuncDefStmt( fd, env ){
		function f(){
			// extract the arguments for this function call
			var args = Array.prototype.slice.call( arguments );
			
			// the first argument is the environment
			var innerenv = args[0]
		
			return apply( fd, innerenv, args.slice(1) ); 
		}

		// store the function definition
		env.set(s.id, f);
	}

	function apply( fd, env, args ){	
		// bind the function arguments to the inner env
		var il = fd.il;
		var i = 1;

		while( il != undefined ){
			env.set( il.id.id, args[i++] );
			il = il.il;
		}

		// interpret the statements
		return interpStmtList( fd.sl, env );	
	}

})(exports);




