var ast = require('./ast')
	Env = require('./env').Env;

(function(interp){

	//
	// Interpreter
	//
	
	function builtins(exts){
		var env = new Env();

		if (exts){
			for (var id in exts){
				env.set( id, exts[id] );
			}
		}
		
		env.set("print", console.log);
		return env;
	}

	function Interpreter(exts){
		this.exts = exts;
	};

	exports.Interpreter = Interpreter;

	Interpreter.prototype.eval = function( sl ){
		var globals = builtins( this.exts );

		interpFuncDefStmts( sl, globals ); 				

		interpStmtList( sl, globals );
	}
	
	function interpFuncDefStmts( sl, env ){
		var r, s;
		while ( sl != undefined ){
			s = sl.s;
			sl = sl.sl;
			if ( s instanceof ast.FuncDefStmt ) 
				interpFuncDefStmt( s, env );
		}
	}
	
	function interpStmtList( sl, env ){
		var r, s;
		while ( sl != undefined ){
			s = sl.s;
			sl = sl.sl;
			if ( !(s instanceof ast.FuncDefStmt)) 
				r = interpStmt( s, env );
		}
		
		return r;
	}

	function interpExpr( e, env ){
		if ( e instanceof ast.BinOpExpr ){
			return interpBinOpExpr( e, env );
		} else if ( e instanceof ast.ApplyExpr ){
			return interpApplyExpr( e, env );
		} else if ( e instanceof ast.Id ){
			return interpId(e, env);
		} else if ( e instanceof ast.IntLit ){
			return interpIntLit( e );	
		} else if ( e instanceof ast.FloatLit ){
			return interpFloatLit( e );
		} else if ( e instanceof ast.BoolLit ){
			return interpBoolLit( e );
		} else if ( e instanceof ast.StringLit ){
			return interpStringLit( e );
		} else if ( e instanceof ast.ArrayLit ){
			return interpArrayLit( e, env );
		} else if ( e instanceof ast.ArrayIndexExpr ){
			return interpArrayIndexExpr( e, env );
		}

		throw new Error("Unknown expression type");
	}

	function interpArrayIndexExpr( e, env ){
		var array = interpExpr( e.a, env );
		var index = interpExpr( e.i, env );
		return array[index];
	}

	function interpArrayLit( e, env ){
		return interpExprList( e.el, env );	
	}

	function interpStringLit( e ){
		return e.v.slice(1, e.v.length-1);
	}

	function interpBoolLit( e ){
		return e.v === "true"; 
	}

	function interpFloatLit( e ){
		return parseFloat( e.v );
	}	

	function interpIntLit( e ){
		return parseInt( e.v ); 
	}

	function interpId( e, env ){
		return env.lookup( e.id );
	}

	function interpBinOpExpr( e, env ){
		switch( e.op ){
			case "+": 
				return interpExpr( e.lhs, env ) + interpExpr( e.rhs, env );
			case "-":
				return interpExpr( e.lhs, env ) - interpExpr( e.rhs, env );
		}

		throw new Error( "Unknown binary operator type" );
	}
	
	function interpStmt( s, env ){
		if ( s instanceof ast.FuncDefStmt){
			return interpFuncDefStmt( s, env );
		} else if ( s instanceof ast.AssignStmt ) {
			return interpAssignStmt( s, env );
		} else if ( s instanceof ast.ReturnStmt ){
			return interpReturnStmt( s, env ); 	
		} else if ( s instanceof ast.IfStmt ){
			return interpIfStmt( s, env );	
		}

		throw new Error("No clause for statement");
	}

	function interpReturnStmt( s, env ){
		return interpExpr( s.e, env );
	}

	function interpIfStmt( s, env ){
		var test = interpExpr( s.test, env );
		if (test === true){
			return interpBlockStmt( s.tsl, env );  
		} else {	
			return interpStmt( s.fsl, env );
		}	
	}

	function interpBlockStmt( sl, env ){	
		return interpStmtList( sl, new Env(env) );
	}

	function interpApplyExpr( e, env ){
		var fd = env.lookup( e.fid.id );
		return fd.apply( undefined, interpExprList( e.el, env ) );  
	}

	function interpExprList( el, env ){
		var vs = [];
		while (el != undefined){
			vs.push( interpExpr( el.e, env ));
			el = el.el;
		}
	
		return vs;
	}

	function interpAssignStmt( s, env ){
		env.set( s.id.id, interpExpr( s.e, env ));
	}

	function interpFuncDefStmt( fd, env ){
		function f(){
			var args = Array.prototype.slice.call( arguments );
			return apply( fd, env, args ); 
		}

		env.set(fd.id.id, f);
	}

	function apply( fd, env, args ){	
		var il = fd.il;
		var i = 0;

		while( il != undefined ){
			env.set( il.id.id, args[i++] );
			il = il.il;
		}

		return interpStmtList( fd.sl, env );	
	}

	// built-in types - bool, int, float, var, T[]	

	function replicate( fd ){

		// replication guides are specific to a particular function invocation
		//
		// f( x<1>, y<2>)
		// will do a cartesian product
		//
		// fix arg 1 and iterate through arg 2
		// 
		
		// f( x<1>, y<1> )
		// will do a shortest replication
		// 
		// iterate through arg1 and arg2 simultaneously
		//

		// f( x<1>, y<1>, z<2> );
		//
		// fix x and y, iterate through z
		// then fix the next index of x and y, and iterate through z
		// repeat
		//
		
		// so, what are the steps to perform replication
		//
		// first, extract the expected types from each argument from the fd
		//
		// then, extract the repl guides for each supplied argument
		//
		// determine the actual types of the supplied arguments, you may need to
		// promote a single item to an array
		//
		
		// for each index type
		//   fix the argument indices
		//      for each index type 
		//         fix the argument indices
		
		// 1,2,3
		// a,b,c
		// x,y,z
		//
		// case a: 1a 1b 1c 2a 2b 2c 3a 3b 3c
		//
		// case b: 1a 2b 3c
		//
		
		// step 1: rep guide index -> [arg index]
		// 
		

	}
})(exports);

