//
// Identifiers
//
var IdList = (function () {
    function IdList(id, il) {
        this.id = id;
        this.il = il;
    }
    return IdList;
})();
exports.IdList = IdList;
var Id = (function () {
    function Id(id, t) {
        this.id = id;
        this.t = t;
    }
    return Id;
})();
exports.Id = Id;
var Type = (function () {
    function Type(t) {
        this.t = t;
    }
    return Type;
})();
exports.Type = Type;
//
// Expr 
//
var Expr = (function () {
    function Expr() {
    }
    return Expr;
})();
var IntLit = (function () {
    function IntLit(v) {
        this.v = v;
    }
    return IntLit;
})();
exports.IntLit = IntLit;
var FloatLit = (function () {
    function FloatLit(v) {
        this.v = v;
    }
    return FloatLit;
})();
exports.FloatLit = FloatLit;
var BoolLit = (function () {
    function BoolLit(v) {
        this.v = v;
    }
    return BoolLit;
})();
exports.BoolLit = BoolLit;
var StringLit = (function () {
    function StringLit(v) {
        this.v = v;
    }
    return StringLit;
})();
exports.StringLit = StringLit;
var ArrayLit = (function () {
    function ArrayLit(el) {
        this.el = el;
    }
    return ArrayLit;
})();
exports.ArrayLit = ArrayLit;
var BinOpExpr = (function () {
    function BinOpExpr(op, lhs, rhs) {
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    return BinOpExpr;
})();
exports.BinOpExpr = BinOpExpr;
var ApplyExpr = (function () {
    function ApplyExpr(fid, el) {
        this.fid = fid;
        this.el = el;
    }
    return ApplyExpr;
})();
exports.ApplyExpr = ApplyExpr;
var ArrayIndexExpr = (function () {
    function ArrayIndexExpr(a, i) {
        this.a = a;
        this.i = i;
    }
    return ArrayIndexExpr;
})();
exports.ArrayIndexExpr = ArrayIndexExpr;
var ExprList = (function () {
    function ExprList(e, el) {
        this.e = e;
        this.el = el;
    }
    return ExprList;
})();
exports.ExprList = ExprList;
//
// Statements
//
var Stmt = (function () {
    function Stmt() {
    }
    return Stmt;
})();
exports.Stmt = Stmt;
var StmtList = (function () {
    function StmtList(s, sl) {
        this.s = s;
        this.sl = sl;
    }
    return StmtList;
})();
exports.StmtList = StmtList;
var IfStmt = (function () {
    function IfStmt(test, tsl, fsl) {
        this.test = test;
        this.tsl = tsl;
        this.fsl = fsl;
    }
    return IfStmt;
})();
exports.IfStmt = IfStmt;
var FuncDefStmt = (function () {
    function FuncDefStmt(id, fal, sl) {
        this.id = id;
        this.fal = fal;
        this.sl = sl;
    }
    return FuncDefStmt;
})();
exports.FuncDefStmt = FuncDefStmt;
var AssignStmt = (function () {
    function AssignStmt(id, e) {
        this.id = id;
        this.e = e;
    }
    return AssignStmt;
})();
exports.AssignStmt = AssignStmt;
var ReturnStmt = (function () {
    function ReturnStmt(e) {
        this.e = e;
    }
    return ReturnStmt;
})();
exports.ReturnStmt = ReturnStmt;
// 
// Replication guides
//
var FuncArgExprList = (function () {
    function FuncArgExprList(fa, fal) {
        this.fa = fa;
        this.fal = fal;
    }
    return FuncArgExprList;
})();
exports.FuncArgExprList = FuncArgExprList;
var FuncArgExpr = (function () {
    function FuncArgExpr(e, ri) {
        this.e = e;
        this.ri = ri;
    }
    return FuncArgExpr;
})();
exports.FuncArgExpr = FuncArgExpr;
