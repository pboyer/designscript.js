(function(ast){
	//
	// Literals
	//
	ast.Id = function (id){
		this.id = id;
	}

	ast.IdList = function(id, il){
		this.id = id;
		this.il = il;
	}

	ast.IntLit = function(v){
		this.v = v;
	}

	//
	// Expressions
	//
	ast.BinOpExp = function(op, lhs, rhs){
		this.op = op;
		this.lhs = lhs;
		this.rhs = rhs;
	}

	ast.ApplyExp = function(id, e){
		this.id = id;
		this.e = e;
	}

	ast.ExpList = function(e, el){
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

})(exports);
