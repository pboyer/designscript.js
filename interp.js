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
		return fd.apply( undefined, interpFuncArgExprList( e.el, env ) );  
	}

	function FuncArg( v, rg ){
		this.v = v;
		this.rg = rg;
	}

	function interpFuncArgExprList( fal, env ){
		// each argument has an expression and also a rep guide
		var vs = [];
		while ( fal != undefined ){
			vs.push( new FuncArg( interpExpr(fal.fa.e, env), fal.fa.rg) );
			fal = fal.fal;	
		}
		return vs; 
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
			env.set( il.id.id, args[i++].v );
			il = il.il;
		}

		return interpStmtList( fd.sl, env );	
	}

	function replicate( applyNode ){
	
		// lift all arguments if any of the arguments is an array where the func is expecting a 
		var ri = [[1,2]]; // the indices of the rep guides
		var nrg = ri.length; // num rep guides, if none supplied, we have just one
		var lrf = []; // the shortest array in the replication guide
		var finalArgs = new Array( lrf[0] ); // a structured array representing the final arguments to apply to the function
		var numFuncArgs = 1; // number of arguments to the function
		var i, j, k, l;

		// for every replication guide
		for (i = 0; i < nrg; i++){
			
			// for every element in the argument array for this replication guide
			for (j = 0; j < lrf[i]; j++){

				// for every element already in the current argument array
				for (k = 0; k < finalArgs.length; k++){

					// initialize the arguments for this invocation or obtain from finalArgs
					targs = i === 0 ? new Array(numFuncArgs) : finalArgs[ k ];

					// for every index in the replication guide
					for (l = 0; l < ri[i]; l++){
						targs[ ri[i][l] ] = args[l][j]; // one function argument		
					}
				}
			}
		}

		return finalArgs.map(function(x){
			return func.apply( null, x );
		});
	}
})(exports);

