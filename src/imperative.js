var enviro = require('./environment');
var ast = require('./ast');
var TypedFunctionDefinition = (function () {
    function TypedFunctionDefinition(f, al) {
        if (al === void 0) { al = []; }
        this.f = f;
        this.al = al; // the type identifiers for the func def
    }
    return TypedFunctionDefinition;
})();
exports.TypedFunctionDefinition = TypedFunctionDefinition;
var ReplicatedFunctionArgument = (function () {
    function ReplicatedFunctionArgument(v, rgl) {
        this.v = v;
        this.rgl = rgl;
    }
    return ReplicatedFunctionArgument;
})();
exports.ReplicatedFunctionArgument = ReplicatedFunctionArgument;
var Interpreter = (function () {
    function Interpreter(extensions) {
        this.env = new enviro.Environment();
        this.extensions = extensions;
    }
    Interpreter.prototype.run = function (sl) {
        this.env = this.builtins(this.extensions);
        this.evalFunctionDefinitionNodes(sl);
        this.visitStatementListNode(sl);
    };
    Interpreter.prototype.builtins = function (exts) {
        var e = new enviro.Environment();
        if (exts) {
            for (var id in exts) {
                e.set(id, exts[id]);
            }
        }
        e.set("print", new TypedFunctionDefinition(function (x) { return console.log(x); }));
        return e;
    };
    Interpreter.prototype.evalFunctionDefinitionNodes = function (sl) {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (s instanceof ast.FunctionDefinitionNode)
                s.accept(this);
        }
    };
    Interpreter.prototype.pushEnvironment = function () {
        this.env = new enviro.Environment(this.env);
    };
    Interpreter.prototype.popEnvironment = function () {
        if (this.env == null)
            throw new Error("Cannot pop empty environment!");
        this.env = this.env.outer;
    };
    Interpreter.prototype.visitStatementListNode = function (sl) {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            // empty statement list
            if (!s)
                break;
            // todo: hoist func defs
            if (!(s instanceof ast.FunctionDefinitionNode))
                r = s.accept(this);
        }
        return r;
    };
    Interpreter.prototype.visitReplicationGuideListNode = function (r) {
        throw new Error("visitReplicatedGuideListNode not implemented");
    };
    Interpreter.prototype.visitReplicationGuideNode = function (r) {
        throw new Error("visitReplicatedGuideNode not implemented");
    };
    Interpreter.prototype.visitArrayIndexNode = function (e) {
        var array = e.array.accept(this);
        var index = e.index.accept(this);
        return array[index];
    };
    Interpreter.prototype.visitArrayNode = function (e) {
        return e.expressionList.accept(this);
    };
    Interpreter.prototype.visitStringNode = function (e) {
        return e.value;
    };
    Interpreter.prototype.visitBooleanNode = function (e) {
        return e.value;
    };
    Interpreter.prototype.visitDoubleNode = function (e) {
        return e.value;
    };
    Interpreter.prototype.visitIntNode = function (e) {
        return e.value;
    };
    Interpreter.prototype.visitIdentifierNode = function (e) {
        return this.env.lookup(e.name);
    };
    Interpreter.prototype.visitTypedIdentifierNode = function (e) {
        return this.env.lookup(e.name);
    };
    Interpreter.prototype.visitIdentifierListNode = function (n) {
        return null;
    };
    Interpreter.prototype.visitBinaryExpressionNode = function (e) {
        switch (e.operator) {
            case "+":
                return e.firstExpression.accept(this) + e.secondExpression.accept(this);
            case "-":
                return e.firstExpression.accept(this) - e.secondExpression.accept(this);
            case "*":
                return e.firstExpression.accept(this) * e.secondExpression.accept(this);
            case "<":
                return e.firstExpression.accept(this) < e.secondExpression.accept(this);
            case "||":
                return e.firstExpression.accept(this) || e.secondExpression.accept(this);
            case "==":
                return e.firstExpression.accept(this) == e.secondExpression.accept(this);
            case ">":
                return e.firstExpression.accept(this) > e.secondExpression.accept(this);
        }
        throw new Error("Unknown binary operator type");
    };
    Interpreter.prototype.visitReturnNode = function (s) {
        return s.expression.accept(this);
    };
    Interpreter.prototype.visitIfStatementNode = function (s) {
        var test = s.testExpression.accept(this);
        if (test === true) {
            return this.evalBlockStatement(s.trueStatementList);
        }
        else {
            return s.falseStatementList.accept(this);
        }
    };
    Interpreter.prototype.evalBlockStatement = function (sl) {
        this.pushEnvironment();
        var r = sl.accept(this);
        this.popEnvironment();
        return r;
    };
    Interpreter.prototype.visitFunctionCallNode = function (e) {
        var fd = this.env.lookup(e.functionId.name);
        return this.replicate(fd, e.arguments.accept(this));
    };
    Interpreter.prototype.visitReplicationExpressionNode = function (fa) {
        return new ReplicatedFunctionArgument(fa.expression.accept(this), fa.replicationGuideList);
    };
    Interpreter.prototype.visitExpressionListNode = function (el) {
        var vs = [];
        while (el != undefined) {
            vs.push(el.head.accept(this));
            el = el.tail;
        }
        return vs;
    };
    Interpreter.prototype.visitAssignmentNode = function (s) {
        this.env.set(s.identifier.name, s.expression.accept(this));
    };
    Interpreter.prototype.visitFunctionDefinitionNode = function (fds) {
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            val.push(il.head);
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        fd = new TypedFunctionDefinition(f, val);
        this.env.set(fds.identifier.name, fd);
    };
    Interpreter.prototype.apply = function (fd, env, args) {
        env = new enviro.Environment(env);
        // bind the arguments in the scope 
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            env.set(il.head.name, args[i++]);
            il = il.tail;
        }
        ;
        var current = this.env;
        this.env = env;
        var r = fd.body.accept(this);
        this.env = current;
        return r;
    };
    Interpreter.prototype.replicate = function (fd, args) {
        // we'll need to check for ReplicatedFunctionArgument here
        // if all types match, simply execute
        return fd.f.apply(undefined, args);
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
    };
    return Interpreter;
})();
exports.Interpreter = Interpreter;
