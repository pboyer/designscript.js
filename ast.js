(function(ast){

	//
	// Identifiers
	//
	ast.Id = function(id, t){
		this.id = id;
		this.t = t;
	}

	ast.Type = function(t){
		this.t = t;
	}
	
	ast.IdList = function(id, il){
		this.id = id;
		this.il = il;
	}

	//
	// Literals
	//
	ast.IntLit = function(v){
		this.v = v;
	}
	
	ast.FloatLit = function(v){
		this.v = v;
	}

	ast.BoolLit = function(v){
		this.v = v;
	}

	ast.StringLit = function(v){
		this.v = v;
	}
	
	ast.ArrayLit = function(el){
		this.el = el;
	}


	//
	// Expressions
	//
	ast.BinOpExpr = function(op, lhs, rhs){
		this.op = op;
		this.lhs = lhs;
		this.rhs = rhs;
	}

	ast.ApplyExpr = function(fid, el, rg){
		this.fid = fid;
		this.el = el;
		this.rg = rg;
	}

	ast.ArrayIndexExpr = function(a, i){
		this.a = a;
		this.i = i;
	}

	ast.ExprList = function(e, el){
		this.e = e;
		this.el = el;
	}

	//
	// Statements
	//
	ast.StmtList = function(s, sl){
		this.s = s;
		this.sl = sl;
	}

	ast.IfStmt = function( test, tsl, fsl ){
		this.test = test;
		this.tsl = tsl;
		this.fsl = fsl;
	}

	ast.FuncDefStmt = function(id, fal, sl){
		this.id = id;
		this.fal = fal;
		this.sl = sl;
	}
	
	ast.AssignStmt = function(id, e){
		this.id = id;
		this.e = e;
	}

	ast.ReturnStmt = function(e){
		this.e = e;
	}

	ast.ExprStmt = function(e){
		this.e = e;
	}

	// 
	// Replication guides
	//
	ast.FuncArgExpr = function(e, ri){
		this.e = e;
		this.ri = ri;
	}

	ast.FuncArgExprList = function(fa, fal){
		this.fa = fa;
		this.fal = fal;
	}

})(exports);
