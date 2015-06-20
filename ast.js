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

	ast.Stringlit = function(v){
		this.v = v;
	}

	//
	// Expressions
	//
	ast.BinOpExpr = function(op, lhs, rhs){
		this.op = op;
		this.lhs = lhs;
		this.rhs = rhs;
	}

	ast.ApplyExpr = function(fid, el){
		this.fid = fid;
		this.el = el;
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

	ast.FuncDefStmt = function(id, il, sl){
		this.id = id;
		this.il = il;
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

})(exports);
