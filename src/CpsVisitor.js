var AST = require('./AST');
var Environment_1 = require('./Environment');
var RuntimeTypes_1 = require('./RuntimeTypes');
var Range_1 = require('./Range');
var ImperativeInterpreter = (function () {
    function ImperativeInterpreter(debug) {
        this.env = new Environment_1.Environment();
        // default continuation
        this.debug = function (a, ret) {
            // by default
            ret();
        };
        if (debug) {
            this.debug = debug;
        }
        this.addBuiltins();
    }
    ImperativeInterpreter.prototype.addBuiltins = function () {
        this.env.set('print', new RuntimeTypes_1.TypedFunction(function (x) { return console.log(x); }, [new RuntimeTypes_1.TypedArgument('a', 'var')], 'print'));
    };
    // passes control to someone else
    ImperativeInterpreter.prototype.step = function (node, ret) {
        if (this.debug) {
            this.debug(node, ret);
        }
        else {
            ret();
        }
    };
    ImperativeInterpreter.prototype.run = function (node, ret) {
        var _this = this;
        if (!ret)
            ret = function () { };
        this.evalFunctionDefinitionNodes(node, function () {
            _this.visitStatementListNode(node, ret);
        });
    };
    ImperativeInterpreter.prototype.evalFunctionDefinitionNodes = function (node, ret) {
        var _this = this;
        var iterate = function (n, r) {
            if (!n.head) {
                ret(r);
            }
            else if (n.head instanceof AST.FunctionDefinitionNode) {
                n.head.cpsAccept(_this, function (x) { return iterate(n.tail, x); });
            }
            else {
                iterate(n.tail, r);
            }
        };
        iterate(node, undefined);
    };
    ImperativeInterpreter.prototype.visitStatementListNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var iterate = function (n, r) {
                if (!n || !n.head) {
                    ret(r);
                }
                else if (n.head instanceof AST.FunctionDefinitionNode) {
                    // ignore function definitions
                    iterate(n.tail, r);
                }
                else {
                    n.head.cpsAccept(_this, function (x) { return iterate(n.tail, x); });
                }
            };
            iterate(node, undefined);
        });
    };
    ImperativeInterpreter.prototype.visitIdentifierNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            ret(_this.env.lookup(node.name));
        });
    };
    ImperativeInterpreter.prototype.visitBooleanNode = function (node, ret) {
        this.step(node, function () { return ret(node.value); });
    };
    ImperativeInterpreter.prototype.visitStringNode = function (node, ret) {
        this.step(node, function () { return ret(node.value); });
    };
    ImperativeInterpreter.prototype.visitNumberNode = function (node, ret) {
        this.step(node, function () { return ret(node.value); });
    };
    ImperativeInterpreter.prototype.visitBinaryExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate first expression
            node.firstExpression.cpsAccept(_this, function (a) {
                // evaluate second
                node.secondExpression.cpsAccept(_this, function (b) {
                    // evaluate
                    switch (node.operator) {
                        case '+':
                            return ret(a + b);
                        case '-':
                            return ret(a - b);
                        case '*':
                            return ret(a * b);
                        case '<':
                            return ret(a < b);
                        case '||':
                            return ret(a || b);
                        case '==':
                            return ret(a == b);
                        case '>':
                            return ret(a > b);
                    }
                    throw _this.error('Unknown binary operator type', node.parserState);
                });
            });
        });
    };
    ImperativeInterpreter.prototype.visitAssignmentNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate expression
            node.expression.cpsAccept(_this, function (e) {
                // store the value
                _this.env.set(node.identifier.name, e);
                ret(e);
            });
        });
    };
    ImperativeInterpreter.prototype.visitFunctionCallNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var f = _this.env.lookup(node.functionId.name);
            node.arguments.cpsAccept(_this, function (args) {
                args.push(ret); // last arg is the continuation
                f.func.apply(undefined, args);
                // TODO Replicator.cpsReplicate(f, args, ret)
            });
        });
    };
    ImperativeInterpreter.prototype.visitExpressionListNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            var iterate = function (n, a) {
                if (!n || !n.head) {
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
    ImperativeInterpreter.prototype.visitFunctionDefinitionNode = function (fds, ret) {
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
    ImperativeInterpreter.prototype.apply = function (fd, env, args, ret) {
        var _this = this;
        env = new Environment_1.Environment(env);
        // bind
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            env.set(il.head.name, args[i++]);
            il = il.tail;
        }
        ;
        var current = this.env;
        this.env = env;
        // evaluate the body
        fd.body.cpsAccept(this, function (x) {
            // return to the original environment
            _this.env = current;
            ret(x);
        });
    };
    ImperativeInterpreter.prototype.visitArrayIndexNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate the array
            node.array.cpsAccept(_this, function (arr) {
                // get the index and return
                node.index.cpsAccept(_this, function (i) { return ret(arr[i]); });
            });
        });
    };
    ImperativeInterpreter.prototype.visitArrayNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            return node.expressionList.cpsAccept(_this, ret);
        });
    };
    ImperativeInterpreter.prototype.visitIfStatementNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.testExpression.cpsAccept(_this, function (test) {
                test ?
                    node.trueStatementList.cpsAccept(_this, ret)
                    : node.falseStatementList.cpsAccept(_this, ret);
            });
        });
    };
    ImperativeInterpreter.prototype.visitImperativeBlockNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.statementList.cpsAccept(new ImperativeInterpreter(_this.debug), ret);
        });
    };
    ImperativeInterpreter.prototype.visitRangeExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.start.cpsAccept(_this, function (start) {
                if (typeof start != 'number')
                    throw _this.error('start must be a number.', node.parserState);
                node.end.cpsAccept(_this, function (end) {
                    if (typeof end != 'number')
                        throw _this.error('end must be a number.', node.parserState);
                    if (!node.step)
                        return ret(Range_1.Range.byStartEnd(start, end));
                    node.step.cpsAccept(_this, function (step) {
                        if (typeof step != 'number')
                            throw _this.error('step must be a number.', node.parserState);
                        ret(node.isStepCount ?
                            Range_1.Range.byStepCount(start, end, step) :
                            Range_1.Range.byStepSize(start, end, step));
                    });
                });
            });
        });
    };
    ImperativeInterpreter.prototype.visitReplicationExpressionNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.visitReplicationGuideNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.visitReplicationGuideListNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.visitAssociativeBlockNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.visitIdentifierListNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.error = function (message, state) {
        return new RuntimeTypes_1.DesignScriptError(message, state);
    };
    return ImperativeInterpreter;
})();
exports.ImperativeInterpreter = ImperativeInterpreter;
