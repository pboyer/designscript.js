var Environment_1 = require('./Environment');
var CpsInterpreter = (function () {
    function CpsInterpreter() {
        this.env = new Environment_1.Environment();
        // default continuation
        this.cc = function (a, c) {
            // console.log("OK");
            // console.log(a);
            c();
        };
    }
    // passes control to any external party before continuing
    CpsInterpreter.prototype.step = function (node, ret) {
        this.cc(node, ret);
    };
    CpsInterpreter.prototype.visitStatementListNode = function (node, ret) {
        var _this = this;
        console.log("StatementListNode");
        this.step(node, function () {
            var iterate = function (n) {
                if (!n.head) {
                    return ret(null);
                }
                n.head.cpsAccept(_this, function (_) { return iterate(n.tail); });
            };
            iterate(node);
        });
    };
    CpsInterpreter.prototype.visitIdentifierNode = function (node, ret) {
        var _this = this;
        console.log("IdentifierNode");
        this.step(node, function () {
            console.log("looking up", node.name);
            ret(_this.env.lookup(node.name));
        });
    };
    CpsInterpreter.prototype.visitNumberNode = function (node, ret) {
        console.log("NumberNode");
        this.step(node, function () { return ret(node.value); });
    };
    CpsInterpreter.prototype.visitBinaryExpressionNode = function (node, ret) {
        var _this = this;
        console.log("BinaryExpressionNode");
        this.step(node, function () {
            // evaluate first expression
            node.firstExpression.cpsAccept(_this, 
            // evaluate second
            // evaluate second
            function (a) { return node.secondExpression.cpsAccept(_this, 
            // return the sum
            // return the sum
            function (b) { return ret(a + b); }); });
        });
    };
    CpsInterpreter.prototype.visitAssignmentNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate first expression
            node.expression.cpsAccept(_this, 
            // store
            // store
            function (e) { return ret(_this.env.set(node.identifier.name, e)); });
        });
    };
    CpsInterpreter.prototype.visitIdentifierListNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitBooleanNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitStringNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitArrayNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitRangeExpressionNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitFunctionCallNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitArrayIndexNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitExpressionListNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitIfStatementNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitFunctionDefinitionNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationExpressionNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationGuideNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitReplicationGuideListNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitImperativeBlockNode = function (node, c) { throw new Error("Not implemented"); };
    CpsInterpreter.prototype.visitAssociativeBlockNode = function (node, c) { throw new Error("Not implemented"); };
    return CpsInterpreter;
})();
exports.CpsInterpreter = CpsInterpreter;
