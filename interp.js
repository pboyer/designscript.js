var ast = require('./ast')
	Env = require('./env').Env;

(function(interp){

	//
	// Interpreter
	//
	
	function builtins(){
		var env = new Env();
		env.set("print", console.log);
		return env;
	}

	function Interpreter(){};

	exports.Interpreter = Interpreter;

	Interpreter.prototype.eval = function( sl ){
		var globals = builtins();

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
		}

		throw new Error("Unknown expression type");
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
		} else if ( s instanceof ast.ExprStmt ){
			return interpExprStmt( s, env );
		}

		throw new Error("No clause for statement");
	}

	function interpExprStmt( s, env ){
		interpExpr( s.e, env );	
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
		env.set( s.id.id, interpExpr( s.e ));
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

})(exports);

