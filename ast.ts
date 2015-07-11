

//
// Identifiers
//

export class IdList { 
    id : Id;
    il : IdList;
    
    constructor(id : Id, il : IdList){
        this.id = id;
        this.il = il;
	}
}

export class Id { 
    id : string;
    t : Type;

    constructor(id : string, t : Type) {
        this.id = id;
        this.t = t;
	}
}

export class Type { 
    t : string;
    
    constructor(t : string){
        this.t = t;
    }
}

//
// Expr 
//
export class Expr {}

export class IntLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}
}

export class FloatLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}
}

export class BoolLit implements Expr { 
    v : boolean;
    
    constructor(v : boolean){
        this.v = v;
	}
}

export class StringLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}
}

export class ArrayLit implements Expr { 
    el : ExprList;
    
    constructor(el : ExprList){
        this.el = el;
	}
}

export class BinOpExpr implements Expr { 
    op : string;
    lhs : Expr;
    rhs : Expr;
    
    constructor(op : string, lhs : Expr, rhs : Expr){
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
	}
}

export class ApplyExpr implements Expr { 
    fid : Id;
    el : FuncArgExprList;
    
    constructor(fid, el){
        this.fid = fid;
        this.el = el;
	}
}

export class ArrayIndexExpr implements Expr { 
    a : Expr;
    i : Expr;
    
    constructor(a : Expr, i : Expr){
        this.a = a;
        this.i = i;
	}
}

export class ExprList { 
    e : Expr;
    el : ExprList;

    constructor(e : Expr, el : ExprList ){
        this.e = e;
        this.el = el;
	}
}

//
// Statements
//
export class Stmt {}

export class StmtList { 
    s : Stmt;
    sl : StmtList;
    
    constructor(s : Stmt, sl : StmtList){
        this.s = s;
        this.sl = sl;
	}
}

export class IfStmt implements Stmt { 
    test : Expr;
    tsl : StmtList;
    fsl : StmtList;

    constructor( test, tsl, fsl ){
        this.test = test;
        this.tsl = tsl;
        this.fsl = fsl;
	}
}

export class FuncDefStmt implements Stmt { 
    id : Id;
    il : IdList;
    sl : StmtList;
    
    constructor(id : Id, il : IdList, sl : StmtList ){
        this.id = id;
        this.il = il;
        this.sl = sl;
	}
}

export class AssignStmt implements Stmt { 
    id : Id;
    e : Expr;

    constructor(id, e){
        this.id = id;
        this.e = e;
	}
}

export class ReturnStmt implements Stmt { 
    e : Expr;

    constructor(e){
        this.e = e;
	}
}

// 
// Replication guides
//
export class FuncArgExprList { 
    fa : FuncArgExpr;
    fal : FuncArgExprList;
    
    constructor(fa : FuncArgExpr, fal : FuncArgExprList ){
        this.fa = fa;
        this.fal = fal;
	}
}

export class FuncArgExpr implements Expr { 
    e : Expr;
    ri : Number;
    
    constructor(e : Expr, ri : Number){
        this.e = e;
        this.ri = ri;
	}
}

