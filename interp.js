var enviro = require('./env');
var ast = require('./ast');
var Interpreter = (function () {
    function Interpreter(exts) {
        this.exts = exts;
    }
    Interpreter.prototype.eval = function (sl) {
        var globals = builtins(this.exts);
        interpFuncDefStmts(sl, globals);
        interpStmtList(sl, globals);
    };
    return Interpreter;
})();
exports.Interpreter = Interpreter;
function builtins(exts) {
    var e = new enviro.Env();
    if (exts) {
        for (var id in exts) {
            e.set(id, exts[id]);
        }
    }
    e.set("print", new TypedFuncDef(console.log));
    return e;
}
function interpFuncDefStmts(sl, env) {
    var r, s;
    while (sl != undefined) {
        s = sl.s;
        sl = sl.sl;
        if (s instanceof ast.FuncDefStmt)
            interpFuncDefStmt(s, env);
    }
}
function interpStmtList(sl, env) {
    var r, s;
    while (sl != undefined) {
        s = sl.s;
        sl = sl.sl;
        if (!(s instanceof ast.FuncDefStmt))
            r = interpStmt(s, env);
    }
    return r;
}
function interpExpr(e, env) {
    if (e instanceof ast.BinOpExpr) {
        return interpBinOpExpr(e, env);
    }
    else if (e instanceof ast.ApplyExpr) {
        return interpApplyExpr(e, env);
    }
    else if (e instanceof ast.Id) {
        return interpId(e, env);
    }
    else if (e instanceof ast.IntLit) {
        return interpIntLit(e);
    }
    else if (e instanceof ast.FloatLit) {
        return interpFloatLit(e);
    }
    else if (e instanceof ast.BoolLit) {
        return interpBoolLit(e);
    }
    else if (e instanceof ast.StringLit) {
        return interpStringLit(e);
    }
    else if (e instanceof ast.ArrayLit) {
        return interpArrayLit(e, env);
    }
    else if (e instanceof ast.ArrayIndexExpr) {
        return interpArrayIndexExpr(e, env);
    }
    throw new Error("Unknown expression type");
}
function interpArrayIndexExpr(e, env) {
    var array = interpExpr(e.a, env);
    var index = interpExpr(e.i, env);
    return array[index];
}
function interpArrayLit(e, env) {
    return interpExprList(e.el, env);
}
function interpStringLit(e) {
    return e.v.slice(1, e.v.length - 1);
}
function interpBoolLit(e) {
    return e.v === "true";
}
function interpFloatLit(e) {
    return parseFloat(e.v);
}
function interpIntLit(e) {
    return parseInt(e.v);
}
function interpId(e, env) {
    return env.lookup(e.id);
}
function interpBinOpExpr(e, env) {
    switch (e.op) {
        case "+":
            return interpExpr(e.lhs, env) + interpExpr(e.rhs, env);
        case "-":
            return interpExpr(e.lhs, env) - interpExpr(e.rhs, env);
    }
    throw new Error("Unknown binary operator type");
}
function interpStmt(s, env) {
    if (s instanceof ast.FuncDefStmt) {
        return interpFuncDefStmt(s, env);
    }
    else if (s instanceof ast.AssignStmt) {
        return interpAssignStmt(s, env);
    }
    else if (s instanceof ast.ReturnStmt) {
        return interpReturnStmt(s, env);
    }
    else if (s instanceof ast.IfStmt) {
        return interpIfStmt(s, env);
    }
    throw new Error("No clause for statement");
}
function interpReturnStmt(s, env) {
    return interpExpr(s.e, env);
}
function interpIfStmt(s, env) {
    var test = interpExpr(s.test, env);
    if (test === true) {
        return interpBlockStmt(s.tsl, env);
    }
    else {
        return interpStmt(s.fsl, env);
    }
}
function interpBlockStmt(sl, env) {
    return interpStmtList(sl, new env.Env(env));
}
function interpApplyExpr(e, env) {
    var fd = env.lookup(e.fid.id);
    return replicate(fd, interpFuncArgExprList(e.el, env));
}
var ReplicatedFuncArg = (function () {
    function ReplicatedFuncArg(v, rg) {
        this.v = v;
        this.rg = rg;
    }
    return ReplicatedFuncArg;
})();
exports.ReplicatedFuncArg = ReplicatedFuncArg;
function interpFuncArgExprList(fal, env) {
    // each argument has an expression and also a rep guide
    var vs = [];
    while (fal != undefined) {
        vs.push(new ReplicatedFuncArg(interpExpr(fal.fa.e, env), fal.fa.rg));
        fal = fal.fal;
    }
    return vs;
}
function interpExprList(el, env) {
    var vs = [];
    while (el != undefined) {
        vs.push(interpExpr(el.e, env));
        el = el.el;
    }
    return vs;
}
function interpAssignStmt(s, env) {
    env.set(s.id.id, interpExpr(s.e, env));
}
var TypedFuncDef = (function () {
    function TypedFuncDef(f, al) {
        if (al === void 0) { al = []; }
        this.f = f;
        this.al = al; // the type identifiers for the func def
    }
    return TypedFuncDef;
})();
exports.TypedFuncDef = TypedFuncDef;
function interpFuncDefStmt(fds, env) {
    // unpack the argument list 
    var il = fds.il;
    var val = [];
    while (il != undefined) {
        val.push(il.id);
        il = il.il;
    }
    var fd;
    function f() {
        var args = Array.prototype.slice.call(arguments);
        return apply(fd, env, args);
    }
    fd = new TypedFuncDef(f, val);
    env.set(fds.id.id, fd);
}
function apply(fd, env, args) {
    // bind the arguments in the scope 
    var i = 0;
    fd.al.forEach(function (x) {
        env.set(x.id.id, args[i++]);
    });
    return interpStmtList(fd.sl, env);
}
function replicate(fd, args) {
    console.log(fd, args);
    // if all types match, simply execute
    return fd.f.apply(undefined, args.map(function (x) { return x.v; }));
    /*
     *
    // form the indices of all arguments
    var ri = (new Array(fd.al.length))
        .map(function(){ return []; });

    args.forEach(function(x,i){ if (x.rg === undefined) ri[0].push(i); else ri[i-1].push(i); })

    var nrg = ri.length; // num rep guides, if none supplied, we have just one
    var lrf = []; // the shortest array in the replication guide
    var finalArgs = new Array( lrf[0] ); // a structured array representing the final arguments to apply to the function
    var numFuncArgs = 1; // number of arguments to the function
    var i, j, k, l;

    // if all of the arguments match their expected types, execute
    // otherwise, we must divide all of the non-matching fields and recurse

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
        return fd.f.apply( null, x );
    });
*/
}
