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

    toString() {
        return this.il == null ? 
            this.id.toString() : 
            this.id.toString() + ", " + this.il.toString();
    }
}

export class Id { 
    id : string;
    t : Type;

    constructor(id : string, t : Type) {
        this.id = id;
        this.t = t;
	}

    toString() {
        return this.t == null ?
            this.id :
            this.id + " : " + this.t.toString();
    }
}

export class Type { 
    t : string;
    
    constructor(t : string){
        this.t = t;
    }

    toString(){
        return this.t;
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

    toString() {
        return this.v;
    }
}

export class FloatLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}

    toString() {
        return this.v;
    }
}

export class BoolLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}

    toString() {
        return this.v;
    }
}

export class StringLit implements Expr { 
    v : string;
    
    constructor(v : string){
        this.v = v;
	}

    toString() {
        return this.v;
    }
}

export class ArrayLit implements Expr { 
    el : ExprList;
    
    constructor(el : ExprList){
        this.el = el;
	}

    toString(){
        return "{ " + this.el.toString() + " }";
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

    toString() {
        return this.lhs.toString() + " " + this.op + " " + this.rhs.toString();
    }
}

export class ApplyExpr implements Expr { 
    fid : Id;
    el : FuncArgExprList;
    
    constructor(fid : Id, el : FuncArgExprList ){
        this.fid = fid;
        this.el = el;
	}

    toString() {
        return this.fid.toString() + "( " + this.el.toString() + " )";
    }
}

export class ArrayIndexExpr implements Expr { 
    a : Expr;
    i : Expr;
    
    constructor(a : Expr, i : Expr){
        this.a = a;
        this.i = i;
    }

    toString() {
        return this.a.toString() + "[ " + this.i.toString() + " ]";
    }
}

export class ExprList { 
    e : Expr;
    el : ExprList;

    constructor(e : Expr, el : ExprList ){
        this.e = e;
        this.el = el;
	}

    toString() {
        var s = this.e.toString();
        var el = this.el;
        while (el != null){
            s = s + ", ";
            s = s + el.e.toString();
            el = el.el;
        }
        return s;
    }
}

//
// Statements
//

export class Stmt {
    toString() {
        return this.toLines("").join("\n");
    }

    toLines( indent : string ) : string[] {
        return [];    
    }
}

export class StmtList extends Stmt { 
    s : Stmt;
    sl : StmtList;
    
    constructor(s : Stmt, sl : StmtList){
        super();
        this.s = s;
        this.sl = sl;
	}

    toLines( indent : string ){
        var s = this.s.toLines( indent );
        var sl = this.sl;
        while (sl != null){
            s = s.concat( sl.s.toLines( indent ) );
            sl = sl.sl;
        }
        return s;
    }
}

export class IfStmt extends Stmt { 
    test : Expr;
    tsl : StmtList;
    fsl : StmtList;

    constructor( test : Expr, tsl : StmtList, fsl : StmtList ){
        super();
        this.test = test;
        this.tsl = tsl;
        this.fsl = fsl;
	}

    toLines( indent : string ) {
        return [ indent + "if( " + this.test.toString() + " ){" ]
            .concat( this.tsl.toLines( indent + "\t" ) )
            .concat( [" } else { "] )
            .concat( this.fsl.toLines( indent + "\t" ) );
    }
}

export class FuncDefStmt extends Stmt { 
    id : Id;
    il : IdList;
    sl : StmtList;
    
    constructor(id : Id, il : IdList, sl : StmtList ){
        super();
        this.id = id;
        this.il = il;
        this.sl = sl;
	}

    toLines( indent : string ) {
        return [ indent + "def " + this.id.toString() + "( " + this.il.toString() + " ){" ]
            .concat( this.sl.toLines( "\t" + indent ) )
            .concat( [ indent + "}" ] );
    }
}

export class AssignStmt extends Stmt { 
    id : Id;
    e : Expr;

    constructor(id : Id, e : Expr){
        super();
        this.id = id;
        this.e = e;
	}

    toLines( indent ) {
        return [ indent + this.id.toString() + " = " + this.e.toString() + ";" ];
    }
}

export class ReturnStmt extends Stmt { 
    e : Expr;

    constructor(e : Expr){
        super();
        this.e = e;
	}

    toLines( indent ){
        return [ indent + "return = " + this.e.toString() + ";" ];
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

    toString() {
        var s = this.fa.toString();
        var fal = this.fal;
        while( fal != null ){
            s += ", ";
            s += fal.fa.toString();
        }

        return s;
    }
}

export class FuncArgExpr implements Expr { 
    e : Expr;
    ri : Number;
    
    constructor(e : Expr, ri : Number){
        this.e = e;
        this.ri = ri;
	}

    toString(){
        return this.e.toString() + "<" + this.ri + ">";
    }
}

