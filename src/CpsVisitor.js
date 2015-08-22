var Environment_1 = require('./Environment');
var RuntimeTypes_1 = require('./RuntimeTypes');
var CpsInterpreter = (function () {
    function CpsInterpreter(debug) {
        this.env = new Environment_1.Environment();
        // default continuation
        this.debug = function (a, ret) {
            // by default
            ret();
        };
        if (debug) {
            this.debug = debug;
        }
    }
    // passes control to someone else
    CpsInterpreter.prototype.step = function (node, ret) {
        if (this.debug) {
            this.debug(node, ret);
        }
        else {
            ret();
        }
    };
    CpsInterpreter.prototype.visitStatementListNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var iterate = function (n, r) {
                if (!n.head) {
                    ret(r);
                }
                else {
                    n.head.cpsAccept(_this, function (x) { return iterate(n.tail, x); });
                }
            };
            iterate(node, undefined);
        });
    };
    CpsInterpreter.prototype.visitIdentifierNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            ret(_this.env.lookup(node.name));
        });
    };
    CpsInterpreter.prototype.visitNumberNode = function (node, ret) {
        this.step(node, function () { return ret(node.value); });
    };
    CpsInterpreter.prototype.visitBinaryExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate first expression
            node.firstExpression.cpsAccept(_this, 
            // evaluate second
            // evaluate second
            function (a) { return node.secondExpression.cpsAccept(_this, 
            // return the sum
            // TODO include all of the type operators
            // return the sum
            // TODO include all of the type operators
            function (b) { return ret(a + b); }); });
        });
    };
    CpsInterpreter.prototype.visitAssignmentNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate first expression
            node.expression.cpsAccept(_this, 
            // store the value
            // store the value
            function (e) {
                _this.env.set(node.identifier.name, e);
                ret(e);
            });
        });
    };
    CpsInterpreter.prototype.visitFunctionCallNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var f = _this.env.lookup(node.functionId.name);
            node.arguments.cpsAccept(_this, function (args) {
                args.push(ret); // last arg is the continuation
                f.func.apply(undefined, args);
            });
        });
        // Replicator.cpsReplicate(f, args, ret)
    };
    CpsInterpreter.prototype.visitExpressionListNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var iterate = function (n, a) {
                if (!n.head) {
                    ret(a);
                }
                else {
                    n.head.cpsAccept(_this, function (x) {
                        a.push(x);
                        iterate(n.tail, a);
                    });
                }
            };
            iterate(node, []);
        });
    };
    CpsInterpreter.prototype.visitFunctionDefinitionNode = function (fds, ret) {
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new RuntimeTypes_1.TypedArgument(il.head.name, t ? t.name : undefined));
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            // sad, but necessary
            var args = Array.prototype.slice.call(arguments);
            var r = args.pop(); // pull out the continuation
            interpreter.apply(fds, env, args, r);
        }
        // recursion
        env.set(fds.identifier.name, f);
        fd = new RuntimeTypes_1.TypedFunction(f, val, fds.identifier.name);
        this.env.set(fds.identifier.name, fd);
        ret(undefined);
    };
    CpsInterpreter.prototype.apply = function (fd, env, args, ret) {
        var _this = this;
        env = new Environment_1.Environment(env);
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
        fd.body.cpsAccept(this, function (x) {
            _this.env = current;
            ret(x);
        });
    };
    CpsInterpreter.prototype.visitIdentifierListNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitArrayIndexNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitIfStatementNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationExpressionNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationGuideNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationGuideListNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitImperativeBlockNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitAssociativeBlockNode = function (node, ret) { throw new Error("Not implemented"); };
    // easy
    CpsInterpreter.prototype.visitBooleanNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitStringNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitArrayNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitRangeExpressionNode = function (node, ret) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.error = function (message, state) {
        return new RuntimeTypes_1.DesignScriptError(message, state);
    };
    return CpsInterpreter;
})();
exports.CpsInterpreter = CpsInterpreter;
