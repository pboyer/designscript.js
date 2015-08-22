var AssociativeInterpreter_1 = require('./AssociativeInterpreter');
var Environment_1 = require('./Environment');
var RuntimeTypes_1 = require('./RuntimeTypes');
var Replicator_1 = require('./Replicator');
var AsyncAssociativeInterpreter = (function () {
    function AsyncAssociativeInterpreter() {
        this.env = new Environment_1.Environment();
        this.pending = [];
        this.addBuiltins();
    }
    AsyncAssociativeInterpreter.prototype.lookup = function (id) {
        return this.env.lookup(id);
    };
    AsyncAssociativeInterpreter.prototype.set = function (id, val) {
        return this.env.set(id, val);
    };
    AsyncAssociativeInterpreter.prototype.addBuiltins = function () {
        this.set('print', new RuntimeTypes_1.TypedFunction(function (x) { return console.log(x); }, [new RuntimeTypes_1.TypedArgument('a', 'var')], 'print'));
    };
    AsyncAssociativeInterpreter.prototype.visitStatementListNode = function (sl) {
        var r, s, pp;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (!sl)
                break;
            s.accept(this);
        }
        this.debug();
        return pp;
    };
    AsyncAssociativeInterpreter.prototype.debug = function () {
        while (this.pending.length) {
            var p = this.pending.shift();
            p();
            console.log('step', this.pending.length);
        }
    };
    AsyncAssociativeInterpreter.prototype.continue = function () {
        this.debug();
    };
    AsyncAssociativeInterpreter.prototype.deferDebug = function (node) {
        var r;
        var p = new Promise(function (resolve, reject) { r = resolve; });
        this.pending.push(function () {
            r();
        });
        return p;
    };
    AsyncAssociativeInterpreter.prototype.visitIdentifierNode = function (node) {
        var _this = this;
        console.log('IdentifierNode');
        return this.deferDebug(node).then(function () { return _this.lookup(node.name); });
    };
    AsyncAssociativeInterpreter.prototype.visitAssignmentNode = function (node) {
        var _this = this;
        console.log('AssignmentNode');
        var d = this.deferDebug(node);
        var pe = node.expression.accept(this);
        var id = node.identifier.name;
        return Promise.all([d, pe]).then(function (ps) { _this.env.set(id, ps[0]); return ps[1]; });
    };
    AsyncAssociativeInterpreter.prototype.visitNumberNode = function (node) {
        console.log('NumberNode');
        return this.deferDebug(node).then(function () { return AssociativeInterpreter_1.DependencyNode.constant(node.value); });
    };
    AsyncAssociativeInterpreter.prototype.visitBinaryExpressionNode = function (node) {
        console.log('BinaryExpressionNode');
        var dp = this.deferDebug(node);
        var ap = node.firstExpression.accept(this);
        var bp = node.secondExpression.accept(this);
        return Promise.all([dp, ap, bp]).then(function (dns) {
            console.log('hi!');
            // TODO lookup type
            var n = new AssociativeInterpreter_1.DependencyNode(function (a, b) { return a + b; });
            connect(dns[1], n, 0);
            connect(dns[2], n, 1);
            return n.eval();
        });
    };
    AsyncAssociativeInterpreter.prototype.visitFunctionCallNode = function (node) {
        console.log('FunctionCallNode');
        var f = this.lookup(node.functionId.name);
        if (f instanceof RuntimeTypes_1.TypedFunction) {
            var d = this.deferDebug(node);
            // unpack the dependencies
            var el = node.arguments;
            var i = 0;
            var dependencies = [this.deferDebug(node)];
            while (el) {
                var e = el.head;
                el = el.tail;
                dependencies.push(e.accept(this));
            }
            // when all of the promises are ready, do the function call
            return Promise.all(dependencies).then(function (deps) {
                var n = new AssociativeInterpreter_1.DependencyNode(function () { return Replicator_1.Replicator.replicate(f, Array.prototype.slice.call(arguments)); });
                deps.slice(1).forEach(function (d) {
                    connect(d, n, i++);
                });
                return n.eval();
            });
        }
        throw this.error(node.functionId.name + ' is not a function.', node.parserState);
    };
    AsyncAssociativeInterpreter.prototype.visitIdentifierListNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitBooleanNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitStringNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitArrayNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitRangeExpressionNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitArrayIndexNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitExpressionListNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitIfStatementNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitFunctionDefinitionNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitReplicationExpressionNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitReplicationGuideNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitReplicationGuideListNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitImperativeBlockNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.visitAssociativeBlockNode = function (node) { return null; };
    AsyncAssociativeInterpreter.prototype.error = function (message, state) {
        return new RuntimeTypes_1.DesignScriptError(message, state);
    };
    return AsyncAssociativeInterpreter;
})();
exports.AsyncAssociativeInterpreter = AsyncAssociativeInterpreter;
function connect(s, e, i) {
    if (s === e)
        throw new Error('Cannot connect a node to itself');
    s.outputs.push(e);
    e.inputs[i] = s;
}
function disconnect(s, e, i) {
    var i = s.outputs.indexOf(e);
    s.outputs.splice(i, 1);
    e.inputs[i] = null;
}
