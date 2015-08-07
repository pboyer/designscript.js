var enviro = require('./environment');
var ast = require('./ast');
var TypedFunction = (function () {
    function TypedFunction(f, al, name) {
        this.func = f;
        this.argumentTypes = al;
        this.name = name;
    }
    return TypedFunction;
})();
exports.TypedFunction = TypedFunction;
var TypedArgument = (function () {
    function TypedArgument(name, typeName) {
        if (typeName === void 0) { typeName = "var"; }
        this.name = name;
        this.typeName = typeName;
    }
    return TypedArgument;
})();
exports.TypedArgument = TypedArgument;
var ReplicatedExpression = (function () {
    function ReplicatedExpression(v, rgl) {
        this.value = v;
        this.replicationGuides = rgl;
    }
    return ReplicatedExpression;
})();
exports.ReplicatedExpression = ReplicatedExpression;
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
        e.set("print", new TypedFunction(function (x) { return console.log(x); }, [new TypedArgument("a")], "print"));
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
    Interpreter.prototype.visitNumberNode = function (e) {
        return e.value;
    };
    Interpreter.prototype.visitIdentifierNode = function (e) {
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
        return new ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList);
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
            var t = il.head.type;
            val.push(new TypedArgument(il.head.name, t ? t.name : undefined));
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        fd = new TypedFunction(f, val, fds.identifier.name);
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
    Interpreter.prototype.isObjectTypeMatch = function (arg, typeName) {
        if (typeName === void 0) { typeName = "var"; }
        if (arg === undefined || arg === null) {
            return false;
        }
        if (typeName === "var" && arg.constructor != Array) {
            return true;
        }
        if (typeName === "var[]..[]") {
            return true;
        }
        if (typeof arg === typeName) {
            return true;
        }
        // consider types like Foo[][]
        while (arg != undefined && arg != null && typeName.indexOf('[]') != -1 && arg.constructor === Array) {
            arg = arg[0];
            typeName = typeName.slice(0, -2);
            if (typeof arg === typeName)
                return true;
        }
        return false;
    };
    Interpreter.prototype.allTypesMatch = function (args, expectedTypes) {
        // if no supplied, just use default js dispatch
        if (!expectedTypes || !args) {
            return true;
        }
        // if the Number of args and expected types don't match, return false
        if (args.length != expectedTypes.length) {
            return false;
        }
        // for each arg type, check match with expected input types
        for (var i = 0, l = args.length; i < l; i++) {
            // do a fast type match
            if (!this.isObjectTypeMatch(args[i], expectedTypes[i])) {
                return false;
            }
        }
        return true;
    };
    Interpreter.prototype.replicate = function (fd, args) {
        var expectedTypes = fd.argumentTypes.map(function (x) { return x.typeName; });
        if (args.length != expectedTypes.length) {
            throw new Error("Not enough arguments supplied to " + fd.name
                + " - expected " + fd.argumentTypes.length + ", but got " + args.length);
        }
        if (this.allTypesMatch(args, expectedTypes)) {
            return fd.func.apply(undefined, args);
        }
        console.log(expectedTypes, args);
        throw new Error("Types do not match!");
        // if the funcrgs in the first argument are a list
        // for each a in args[0]
        //  replicate( fd, [ a, rest of args ] )
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
    Interpreter.prototype.visitImperativeBlockNode = function (node) { throw new Error("Not implemented"); };
    ;
    Interpreter.prototype.visitAssociativeBlockNode = function (node) { throw new Error("Not implemented"); };
    ;
    return Interpreter;
})();
exports.Interpreter = Interpreter;
