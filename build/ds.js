(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ds = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Node = (function () {
    function Node() {
    }
    return Node;
})();
exports.Node = Node;
var ParserState = (function () {
    function ParserState() {
    }
    return ParserState;
})();
exports.ParserState = ParserState;
//
// IdentifierNode
//
var IdentifierListNode = (function (_super) {
    __extends(IdentifierListNode, _super);
    function IdentifierListNode(id, il) {
        _super.call(this);
        this.head = id;
        this.tail = il;
    }
    IdentifierListNode.prototype.toString = function () {
        return this.tail == null ?
            this.head.toString() :
            this.head.toString() + ', ' + this.tail.toString();
    };
    IdentifierListNode.prototype.accept = function (v) {
        return v.visitIdentifierListNode(this);
    };
    return IdentifierListNode;
})(Node);
exports.IdentifierListNode = IdentifierListNode;
var IdentifierNode = (function (_super) {
    __extends(IdentifierNode, _super);
    function IdentifierNode(id, t) {
        if (t === void 0) { t = null; }
        _super.call(this);
        this.name = id;
        this.type = t;
    }
    IdentifierNode.prototype.toString = function () {
        return this.type ? this.name + ' : ' + this.type.toString() : this.name;
    };
    IdentifierNode.prototype.accept = function (v) {
        return v.visitIdentifierNode(this);
    };
    return IdentifierNode;
})(Node);
exports.IdentifierNode = IdentifierNode;
var Type = (function (_super) {
    __extends(Type, _super);
    function Type(t) {
        _super.call(this);
        this.name = t;
    }
    Type.prototype.toString = function () {
        return this.name;
    };
    return Type;
})(Node);
exports.Type = Type;
var NumberNode = (function (_super) {
    __extends(NumberNode, _super);
    function NumberNode(value) {
        _super.call(this);
        this.value = parseFloat(value);
    }
    NumberNode.prototype.toString = function () {
        return this.value;
    };
    NumberNode.prototype.accept = function (v) {
        return v.visitNumberNode(this);
    };
    return NumberNode;
})(Node);
exports.NumberNode = NumberNode;
var BooleanNode = (function (_super) {
    __extends(BooleanNode, _super);
    function BooleanNode(value) {
        _super.call(this);
        this.value = value === 'true';
    }
    BooleanNode.prototype.toString = function () {
        return this.value;
    };
    BooleanNode.prototype.accept = function (v) {
        return v.visitBooleanNode(this);
    };
    return BooleanNode;
})(Node);
exports.BooleanNode = BooleanNode;
var StringNode = (function (_super) {
    __extends(StringNode, _super);
    function StringNode(value) {
        _super.call(this);
        this.value = value.slice(1, value.length - 1);
    }
    StringNode.prototype.toString = function () {
        return this.value;
    };
    StringNode.prototype.accept = function (v) {
        return v.visitStringNode(this);
    };
    return StringNode;
})(Node);
exports.StringNode = StringNode;
var ArrayNode = (function (_super) {
    __extends(ArrayNode, _super);
    function ArrayNode(el) {
        _super.call(this);
        this.expressionList = el;
    }
    ArrayNode.prototype.toString = function () {
        return '{ ' + this.expressionList.toString() + ' }';
    };
    ArrayNode.prototype.accept = function (v) {
        return v.visitArrayNode(this);
    };
    return ArrayNode;
})(Node);
exports.ArrayNode = ArrayNode;
var BinaryExpressionNode = (function (_super) {
    __extends(BinaryExpressionNode, _super);
    function BinaryExpressionNode(op, lhs, rhs) {
        _super.call(this);
        this.operator = op;
        this.firstExpression = lhs;
        this.secondExpression = rhs;
    }
    BinaryExpressionNode.prototype.toString = function () {
        return this.firstExpression.toString() + ' ' + this.operator + ' ' + this.secondExpression.toString();
    };
    BinaryExpressionNode.prototype.accept = function (v) {
        return v.visitBinaryExpressionNode(this);
    };
    return BinaryExpressionNode;
})(Node);
exports.BinaryExpressionNode = BinaryExpressionNode;
var RangeExpressionNode = (function (_super) {
    __extends(RangeExpressionNode, _super);
    function RangeExpressionNode(start, end, step, isStepCount) {
        if (step === void 0) { step = null; }
        if (isStepCount === void 0) { isStepCount = false; }
        _super.call(this);
        this.start = start;
        if (end instanceof RangeExpressionNode)
            throw new Error('Multiply nested range expressions are not supported');
        this.end = end;
        if (step instanceof RangeExpressionNode)
            throw new Error('step cannot be a RangeExpression');
        this.step = step;
        this.isStepCount = isStepCount;
    }
    RangeExpressionNode.prototype.toString = function () {
        return;
        this.start.toString() + '..' + this.end.toString() +
            (this.step == null ? '' :
                '..' + (this.isStepCount ? '#' : '') + this.step.toString());
    };
    RangeExpressionNode.prototype.accept = function (v) {
        return v.visitRangeExpressionNode(this);
    };
    return RangeExpressionNode;
})(Node);
exports.RangeExpressionNode = RangeExpressionNode;
var FunctionCallNode = (function (_super) {
    __extends(FunctionCallNode, _super);
    function FunctionCallNode(fid, el) {
        _super.call(this);
        this.functionId = fid;
        this.arguments = el;
    }
    FunctionCallNode.prototype.toString = function () {
        return this.functionId.toString() + '( ' + this.arguments.toString() + ' )';
    };
    FunctionCallNode.prototype.accept = function (v) {
        return v.visitFunctionCallNode(this);
    };
    return FunctionCallNode;
})(Node);
exports.FunctionCallNode = FunctionCallNode;
var ArrayIndexNode = (function (_super) {
    __extends(ArrayIndexNode, _super);
    function ArrayIndexNode(a, i) {
        _super.call(this);
        this.array = a;
        this.index = i;
    }
    ArrayIndexNode.prototype.toString = function () {
        return this.array.toString() + '[ ' + this.index.toString() + ' ]';
    };
    ArrayIndexNode.prototype.accept = function (v) {
        return v.visitArrayIndexNode(this);
    };
    return ArrayIndexNode;
})(Node);
exports.ArrayIndexNode = ArrayIndexNode;
var ExpressionListNode = (function (_super) {
    __extends(ExpressionListNode, _super);
    function ExpressionListNode(e, el) {
        _super.call(this);
        this.head = e;
        this.tail = el;
    }
    ExpressionListNode.prototype.toString = function () {
        var s = this.head.toString();
        var el = this.tail;
        while (el != null) {
            s = s + ', ';
            s = s + el.head.toString();
            el = el.tail;
        }
        return s;
    };
    ExpressionListNode.prototype.accept = function (v) {
        return v.visitExpressionListNode(this);
    };
    return ExpressionListNode;
})(Node);
exports.ExpressionListNode = ExpressionListNode;
var ReplicationExpressionNode = (function (_super) {
    __extends(ReplicationExpressionNode, _super);
    function ReplicationExpressionNode(e, ril) {
        _super.call(this);
        this.expression = e;
        this.replicationGuideList = ril;
    }
    ReplicationExpressionNode.prototype.toString = function () {
        return this.expression.toString() + this.replicationGuideList.toString();
    };
    ReplicationExpressionNode.prototype.accept = function (v) {
        return v.visitReplicationExpressionNode(this);
    };
    return ReplicationExpressionNode;
})(Node);
exports.ReplicationExpressionNode = ReplicationExpressionNode;
var ReplicationGuideNode = (function (_super) {
    __extends(ReplicationGuideNode, _super);
    function ReplicationGuideNode(i) {
        _super.call(this);
        this.index = i;
    }
    ReplicationGuideNode.prototype.toString = function () {
        return '<' + this.index.toString() + '>';
    };
    ReplicationGuideNode.prototype.accept = function (v) {
        return v.visitReplicationGuideNode(this);
    };
    return ReplicationGuideNode;
})(Node);
exports.ReplicationGuideNode = ReplicationGuideNode;
var ReplicationGuideListNode = (function (_super) {
    __extends(ReplicationGuideListNode, _super);
    function ReplicationGuideListNode(ri, ril) {
        if (ril === void 0) { ril = null; }
        _super.call(this);
        this.head = ri;
        this.tail = ril;
    }
    ReplicationGuideListNode.prototype.toString = function () {
        return this.head.toString() + this.tail.toString();
    };
    ReplicationGuideListNode.prototype.accept = function (v) {
        return v.visitReplicationGuideListNode(this);
    };
    return ReplicationGuideListNode;
})(Node);
exports.ReplicationGuideListNode = ReplicationGuideListNode;
//
// Statements
//
var StatementNode = (function (_super) {
    __extends(StatementNode, _super);
    function StatementNode() {
        _super.apply(this, arguments);
    }
    StatementNode.prototype.toString = function () {
        return this.toLines('').join('\n');
    };
    StatementNode.prototype.toLines = function (indent) {
        return [];
    };
    return StatementNode;
})(Node);
exports.StatementNode = StatementNode;
var LanguageBlockNode = (function (_super) {
    __extends(LanguageBlockNode, _super);
    function LanguageBlockNode(name, sl) {
        _super.call(this);
        this.name = name;
        this.statementList = sl;
    }
    LanguageBlockNode.prototype.toLines = function (indent) {
        return [indent + '[' + this.name + ']{']
            .concat(this.statementList.toLines(indent + '\t'))
            .concat([indent + '}']);
    };
    return LanguageBlockNode;
})(StatementNode);
exports.LanguageBlockNode = LanguageBlockNode;
var AssociativeBlockNode = (function (_super) {
    __extends(AssociativeBlockNode, _super);
    function AssociativeBlockNode(sl) {
        _super.call(this, 'Associative', sl);
    }
    AssociativeBlockNode.prototype.accept = function (v) {
        return v.visitAssociativeBlockNode(this);
    };
    return AssociativeBlockNode;
})(LanguageBlockNode);
exports.AssociativeBlockNode = AssociativeBlockNode;
var ImperativeBlockNode = (function (_super) {
    __extends(ImperativeBlockNode, _super);
    function ImperativeBlockNode(sl) {
        _super.call(this, 'Imperative', sl);
    }
    ImperativeBlockNode.prototype.accept = function (v) {
        return v.visitImperativeBlockNode(this);
    };
    return ImperativeBlockNode;
})(LanguageBlockNode);
exports.ImperativeBlockNode = ImperativeBlockNode;
var StatementListNode = (function (_super) {
    __extends(StatementListNode, _super);
    function StatementListNode(s, sl) {
        if (s === void 0) { s = null; }
        if (sl === void 0) { sl = null; }
        _super.call(this);
        this.head = s;
        this.tail = sl;
    }
    StatementListNode.prototype.toLines = function (indent) {
        var s = this.head.toLines(indent);
        var sl = this.tail;
        while (sl != null) {
            s = s.concat(sl.head.toLines(indent));
            sl = sl.tail;
        }
        return s;
    };
    StatementListNode.prototype.accept = function (v) {
        return v.visitStatementListNode(this);
    };
    return StatementListNode;
})(StatementNode);
exports.StatementListNode = StatementListNode;
var IfStatementNode = (function (_super) {
    __extends(IfStatementNode, _super);
    function IfStatementNode(test, tsl, fsl) {
        _super.call(this);
        this.testExpression = test;
        this.trueStatementList = tsl;
        this.falseStatementList = fsl;
    }
    IfStatementNode.prototype.toLines = function (indent) {
        return [indent + 'if( ' + this.testExpression.toString() + ' ){']
            .concat(this.trueStatementList.toLines(indent + '\t'))
            .concat([indent + ' } else { '])
            .concat(this.falseStatementList.toLines(indent + '\t'));
    };
    IfStatementNode.prototype.accept = function (v) {
        return v.visitIfStatementNode(this);
    };
    return IfStatementNode;
})(StatementNode);
exports.IfStatementNode = IfStatementNode;
var FunctionDefinitionNode = (function (_super) {
    __extends(FunctionDefinitionNode, _super);
    function FunctionDefinitionNode(id, il, sl) {
        _super.call(this);
        this.identifier = id;
        this.arguments = il;
        this.body = sl;
    }
    FunctionDefinitionNode.prototype.toLines = function (indent) {
        return [indent + 'def ' + this.identifier.toString() + '( ' + this.arguments.toString() + ' ){']
            .concat(this.body.toLines('\t' + indent))
            .concat([indent + '}']);
    };
    FunctionDefinitionNode.prototype.accept = function (v) {
        return v.visitFunctionDefinitionNode(this);
    };
    return FunctionDefinitionNode;
})(StatementNode);
exports.FunctionDefinitionNode = FunctionDefinitionNode;
var AssignmentNode = (function (_super) {
    __extends(AssignmentNode, _super);
    function AssignmentNode(id, e) {
        _super.call(this);
        this.identifier = id;
        this.expression = e;
    }
    AssignmentNode.prototype.toLines = function (indent) {
        return [indent + this.identifier.toString() + ' = ' + this.expression.toString() + ';'];
    };
    AssignmentNode.prototype.accept = function (v) {
        return v.visitAssignmentNode(this);
    };
    return AssignmentNode;
})(StatementNode);
exports.AssignmentNode = AssignmentNode;

},{}],2:[function(require,module,exports){
var Environment_1 = require('./Environment');
var ImperativeInterpreter_1 = require('./ImperativeInterpreter');
var Replicator_1 = require('./Replicator');
var Types_1 = require('./Types');
var Range_1 = require('./Range');
var DependencyNode = (function () {
    function DependencyNode(f) {
        this.id = DependencyNode.gid++;
        this.dirty = true;
        this.inputs = [];
        this.outputs = [];
        this.value = null;
        this.f = f;
    }
    DependencyNode.constant = function (val) {
        return new DependencyNode(function () { return val; }).eval();
    };
    DependencyNode.prototype.eval = function () {
        this.value = this.f.apply(null, this.inputs.map(function (x) { return x.value; }));
        this.dirty = false;
        return this;
    };
    DependencyNode.gid = 0;
    return DependencyNode;
})();
exports.DependencyNode = DependencyNode;
var AssociativeInterpreter = (function () {
    function AssociativeInterpreter() {
        this.env = new Environment_1.Environment();
    }
    AssociativeInterpreter.prototype.run = function (sl) {
        return sl.accept(this);
    };
    AssociativeInterpreter.prototype.set = function (id, n) {
        this.env.set(id, n);
    };
    AssociativeInterpreter.prototype.lookup = function (id) {
        return this.env.lookup(id);
    };
    AssociativeInterpreter.prototype.visitNumberNode = function (node) {
        return DependencyNode.constant(node.value);
    };
    AssociativeInterpreter.prototype.visitBooleanNode = function (node) {
        return DependencyNode.constant(node.value);
    };
    AssociativeInterpreter.prototype.visitStringNode = function (node) {
        return DependencyNode.constant(node.value);
    };
    AssociativeInterpreter.prototype.visitStatementListNode = function (node) {
        var n, s, sl = node;
        while (sl) {
            s = sl.head;
            if (!s)
                break;
            n = s.accept(this);
            sl = sl.tail;
        }
        return n;
    };
    AssociativeInterpreter.prototype.visitAssignmentNode = function (node) {
        var id = node.identifier.name;
        var n = node.expression.accept(this);
        if (this.env.contains(id)) {
            throw new Error('You cannot reassign a variable in associative mode!');
        }
        this.set(id, n);
        resolve(n);
        return n;
    };
    AssociativeInterpreter.prototype.visitIdentifierNode = function (node) {
        var n = this.lookup(node.name);
        if (!n) {
            throw new Error('Unbound identifier: ' + node.name);
        }
        if (n instanceof Types_1.TypedFunction) {
            throw new Error('The identifier ' + node.name +
                ' is a function and is being used as a value');
        }
        else if (n instanceof DependencyNode) {
            return n;
        }
        throw new Error('The identifier ' + node.name +
            ' is of an unknown type!');
    };
    AssociativeInterpreter.prototype.visitBinaryExpressionNode = function (node) {
        var n;
        switch (node.operator) {
            case '+':
                n = new DependencyNode(function (a, b) { return a + b; });
                break;
            case '-':
                n = new DependencyNode(function (a, b) { return a - b; });
                break;
            case '*':
                n = new DependencyNode(function (a, b) { return a * b; });
                break;
            case '<':
                n = new DependencyNode(function (a, b) { return a < b; });
                break;
            case '||':
                n = new DependencyNode(function (a, b) { return a || b; });
                break;
            case '==':
                n = new DependencyNode(function (a, b) { return a === b; });
                break;
            case '>':
                n = new DependencyNode(function (a, b) { return a > b; });
                break;
            default:
                throw new Error('Unknown binary operator type');
        }
        connect(node.firstExpression.accept(this), n, 0);
        connect(node.secondExpression.accept(this), n, 1);
        return n.eval();
    };
    AssociativeInterpreter.prototype.visitArrayIndexNode = function (node) {
        var n = new DependencyNode(function (a, i) { return a[i]; });
        var a = node.array.accept(this);
        var i = node.index.accept(this);
        connect(a, n, 0);
        connect(i, n, 1);
        return n.eval();
    };
    AssociativeInterpreter.prototype.visitArrayNode = function (node) {
        var n = new DependencyNode(function () { return Array.prototype.slice.call(arguments); });
        var el = node.expressionList;
        var i = 0;
        while (el) {
            var e = el.head;
            var s = e.accept(this);
            connect(s, n, i++);
            el = el.tail;
        }
        return n.eval();
    };
    AssociativeInterpreter.prototype.visitImperativeBlockNode = function (node) {
        var n = new DependencyNode(function () {
            var i = new ImperativeInterpreter_1.ImperativeInterpreter();
            return i.run(node.statementList);
        });
        return n.eval();
    };
    ;
    AssociativeInterpreter.prototype.visitAssociativeBlockNode = function (node) {
        var n = new DependencyNode(function () {
            var i = new AssociativeInterpreter();
            return i.run(node.statementList).value;
        });
        return n.eval();
    };
    ;
    AssociativeInterpreter.prototype.visitRangeExpressionNode = function (node) {
        var start = node.start.accept(this);
        var end = node.end.accept(this);
        if (!node.step) {
            var n = new DependencyNode(Range_1.Range.byStartEnd);
            connect(start, n, 0);
            connect(end, n, 1);
            return n.eval();
        }
        var step = node.step.accept(this);
        var f = node.isStepCount ? Range_1.Range.byStepCount : Range_1.Range.byStepSize;
        var n = new DependencyNode(f);
        connect(start, n, 0);
        connect(end, n, 1);
        connect(step, n, 2);
        return n.eval();
    };
    ;
    AssociativeInterpreter.prototype.apply = function (fd, env, args) {
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
        var r = fd.body.accept(this);
        this.env = current;
        return r;
    };
    AssociativeInterpreter.prototype.visitFunctionDefinitionNode = function (fds) {
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new Types_1.TypedArgument(il.head.name, t ? t.name : undefined));
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        env.set(fds.identifier.name, f); // recursion
        fd = new Types_1.TypedFunction(f, val, fds.identifier.name);
        this.set(fds.identifier.name, fd);
        return null;
    };
    AssociativeInterpreter.prototype.visitFunctionCallNode = function (node) {
        var f = this.lookup(node.functionId.name);
        if (f instanceof Types_1.TypedFunction) {
            var n = new DependencyNode(function () { return Replicator_1.Replicator.replicate(f, Array.prototype.slice.call(arguments)); });
            var el = node.arguments;
            var i = 0;
            while (el) {
                var e = el.head;
                el = el.tail;
                connect(e.accept(this), n, i++);
            }
            return n.eval();
        }
        throw new Error(node.functionId.name + ' is not a function.');
    };
    AssociativeInterpreter.prototype.visitReplicationExpressionNode = function (node) {
        var e = node.expression.accept(this);
        var l = node.replicationGuideList.accept(this);
        var n = new DependencyNode(function (e, l) { return new Types_1.ReplicatedExpression(e, l); });
        connect(e, n, 0);
        connect(e, l, 1);
        return n.eval();
    };
    AssociativeInterpreter.prototype.visitReplicationGuideListNode = function (rl) {
        var n = new DependencyNode(function () { return Array.prototype.slice.call(arguments); });
        var i = 0;
        while (rl != undefined) {
            connect(rl.head.accept(this), n, i++);
            rl = rl.tail;
        }
        return n.eval();
    };
    AssociativeInterpreter.prototype.visitReplicationGuideNode = function (node) {
        return DependencyNode.constant(node.index);
    };
    AssociativeInterpreter.prototype.visitIdentifierListNode = function (node) { throw new Error('Not implemented'); };
    AssociativeInterpreter.prototype.visitExpressionListNode = function (node) { throw new Error('Not implemented'); };
    AssociativeInterpreter.prototype.visitIfStatementNode = function (node) { throw new Error('Not implemented'); };
    return AssociativeInterpreter;
})();
exports.AssociativeInterpreter = AssociativeInterpreter;
function resolve(node) {
    // mark the nodes
    var marked = new Array(), remaining = [node];
    while (remaining.length) {
        var n = remaining.pop();
        n.dirty = true;
        n.outputs.forEach(function (x) { return remaining.push(x); });
        marked.push(n);
    }
    // topo sort
    var roots = marked.filter(function (x) { return x.inputs.reduce(function (a, y) { return !y.dirty && a; }, true); });
    var sorted = new Array();
    var visited = {};
    while (roots.length) {
        var n = roots.pop();
        visited[n.id] = n;
        sorted.push(n);
        n.outputs.forEach(function (o) {
            var isRoot = o.inputs.reduce(function (a, y) { return (visited[y.id] || !y.dirty) && a; }, true);
            if (isRoot)
                roots.push(o);
        });
    }
    // execute the nodes in order
    sorted.forEach(function (x) { return x.eval(); });
}
function replace(old, rep) {
    rep.outputs = old.outputs;
    rep.inputs = old.inputs;
    rep.outputs.forEach(function (x) {
        var i = x.inputs.indexOf(old);
        x.inputs[i] = rep;
    });
    rep.inputs.forEach(function (x) {
        var i = x.outputs.indexOf(old);
        x.outputs.splice(i, 1);
    });
}
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

},{"./Environment":3,"./ImperativeInterpreter":4,"./Range":6,"./Replicator":7,"./Types":8}],3:[function(require,module,exports){
//
// Environment
//
var Environment = (function () {
    function Environment(outer) {
        if (outer === void 0) { outer = null; }
        this.dict = {};
        this.outer = outer;
    }
    Environment.prototype.contains = function (id) {
        if (this.dict[id] != undefined)
            return true;
        if (this.outer != undefined)
            return this.outer.lookup(id);
        return false;
    };
    Environment.prototype.lookup = function (id) {
        if (this.dict[id] != undefined)
            return this.dict[id];
        if (this.outer != undefined)
            return this.outer.lookup(id);
        throw new Error(id + ' is an unbound identifier!');
    };
    Environment.prototype.set = function (id, val) {
        this.dict[id] = val;
    };
    return Environment;
})();
exports.Environment = Environment;

},{}],4:[function(require,module,exports){
var AST = require('./AST');
var Environment_1 = require('./Environment');
var AssociativeInterpreter_1 = require('./AssociativeInterpreter');
var Replicator_1 = require('./Replicator');
var Types_1 = require('./Types');
var Range_1 = require('./Range');
var ImperativeInterpreter = (function () {
    function ImperativeInterpreter() {
        this.env = new Environment_1.Environment();
        this.addBuiltins();
    }
    ImperativeInterpreter.prototype.run = function (sl) {
        this.evalFunctionDefinitionNodes(sl);
        return this.visitStatementListNode(sl);
    };
    ImperativeInterpreter.prototype.lookup = function (id) {
        return this.env.lookup(id);
    };
    ImperativeInterpreter.prototype.set = function (id, val) {
        return this.env.set(id, val);
    };
    ImperativeInterpreter.prototype.addBuiltins = function () {
        this.set('print', new Types_1.TypedFunction(function (x) { return console.log(x); }, [new Types_1.TypedArgument('a', 'var')], 'print'));
    };
    ImperativeInterpreter.prototype.evalFunctionDefinitionNodes = function (sl) {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            if (s instanceof AST.FunctionDefinitionNode)
                s.accept(this);
        }
    };
    ImperativeInterpreter.prototype.pushEnvironment = function () {
        this.env = new Environment_1.Environment(this.env);
    };
    ImperativeInterpreter.prototype.popEnvironment = function () {
        if (this.env == null)
            throw new Error('Cannot pop empty environment!');
        this.env = this.env.outer;
    };
    ImperativeInterpreter.prototype.visitStatementListNode = function (sl) {
        var r, s;
        while (sl) {
            s = sl.head;
            sl = sl.tail;
            // empty statement list
            if (!s)
                break;
            // todo: hoist func defs
            if (!(s instanceof AST.FunctionDefinitionNode))
                r = s.accept(this);
        }
        return r;
    };
    ImperativeInterpreter.prototype.visitArrayIndexNode = function (e) {
        var array = e.array.accept(this);
        var index = e.index.accept(this);
        return array[index];
    };
    ImperativeInterpreter.prototype.visitArrayNode = function (e) {
        return e.expressionList.accept(this);
    };
    ImperativeInterpreter.prototype.visitStringNode = function (e) {
        return e.value;
    };
    ImperativeInterpreter.prototype.visitBooleanNode = function (e) {
        return e.value;
    };
    ImperativeInterpreter.prototype.visitNumberNode = function (e) {
        return e.value;
    };
    ImperativeInterpreter.prototype.visitIdentifierNode = function (e) {
        return this.lookup(e.name);
    };
    ImperativeInterpreter.prototype.visitIdentifierListNode = function (n) {
        throw new Error('Not implemented!');
    };
    ImperativeInterpreter.prototype.visitRangeExpressionNode = function (node) {
        var start = node.start.accept(this);
        if (typeof start != 'number')
            throw new Error('start must be a number.');
        var end = node.end.accept(this);
        if (typeof end != 'number')
            throw new Error('end must be a number.');
        if (!node.step)
            return Range_1.Range.byStartEnd(start, end);
        var step = node.step.accept(this);
        if (typeof step != 'number')
            throw new Error('step must be a number.');
        return node.isStepCount ?
            Range_1.Range.byStepCount(start, end, step) :
            Range_1.Range.byStepSize(start, end, step);
    };
    ;
    ImperativeInterpreter.prototype.visitBinaryExpressionNode = function (e) {
        var a = e.firstExpression.accept(this);
        var b = e.secondExpression.accept(this);
        switch (e.operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '<':
                return a < b;
            case '||':
                return a || b;
            case '==':
                return a == b;
            case '>':
                return a > b;
        }
        throw new Error('Unknown binary operator type');
    };
    ImperativeInterpreter.prototype.visitIfStatementNode = function (s) {
        var test = s.testExpression.accept(this);
        if (test === true) {
            return this.evalBlockStatement(s.trueStatementList);
        }
        else {
            return s.falseStatementList.accept(this);
        }
    };
    ImperativeInterpreter.prototype.evalBlockStatement = function (sl) {
        this.pushEnvironment();
        var r = sl.accept(this);
        this.popEnvironment();
        return r;
    };
    ImperativeInterpreter.prototype.visitFunctionCallNode = function (e) {
        var fd = this.lookup(e.functionId.name);
        if (!(fd instanceof Types_1.TypedFunction)) {
            throw new Error(e.functionId.name + ' is not a function!');
        }
        return Replicator_1.Replicator.replicate(fd, e.arguments.accept(this));
    };
    ImperativeInterpreter.prototype.visitReplicationExpressionNode = function (fa) {
        return new Types_1.ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList.accept(this));
    };
    ImperativeInterpreter.prototype.visitReplicationGuideListNode = function (rl) {
        var vs = [];
        while (rl != undefined) {
            vs.push(rl.head.accept(this));
            rl = rl.tail;
        }
        return vs;
    };
    ImperativeInterpreter.prototype.visitReplicationGuideNode = function (r) {
        return r.index.accept(this);
    };
    ImperativeInterpreter.prototype.visitExpressionListNode = function (el) {
        var vs = [];
        while (el != undefined) {
            vs.push(el.head.accept(this));
            el = el.tail;
        }
        return vs;
    };
    ImperativeInterpreter.prototype.visitAssignmentNode = function (s) {
        var v = s.expression.accept(this);
        this.set(s.identifier.name, v);
        return v;
    };
    ImperativeInterpreter.prototype.visitFunctionDefinitionNode = function (fds) {
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new Types_1.TypedArgument(il.head.name, t ? t.name : undefined));
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        // recursion
        env.set(fds.identifier.name, f);
        fd = new Types_1.TypedFunction(f, val, fds.identifier.name);
        this.set(fds.identifier.name, fd);
    };
    ImperativeInterpreter.prototype.apply = function (fd, env, args) {
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
        var r = fd.body.accept(this);
        this.env = current;
        return r;
    };
    ImperativeInterpreter.prototype.visitImperativeBlockNode = function (node) {
        var i = new ImperativeInterpreter();
        return i.run(node.statementList);
    };
    ;
    ImperativeInterpreter.prototype.visitAssociativeBlockNode = function (node) {
        var i = new AssociativeInterpreter_1.AssociativeInterpreter();
        return i.run(node.statementList).value;
    };
    ;
    return ImperativeInterpreter;
})();
exports.ImperativeInterpreter = ImperativeInterpreter;

},{"./AST":1,"./AssociativeInterpreter":2,"./Environment":3,"./Range":6,"./Replicator":7,"./Types":8}],5:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,3],$V1=[1,12],$V2=[1,16],$V3=[1,11],$V4=[1,15],$V5=[1,17],$V6=[5,23],$V7=[5,22,23,24,26,31,34],$V8=[1,22],$V9=[2,25],$Va=[1,25],$Vb=[2,24],$Vc=[1,39],$Vd=[1,44],$Ve=[1,38],$Vf=[1,40],$Vg=[1,41],$Vh=[1,42],$Vi=[1,43],$Vj=[2,30],$Vk=[2,23],$Vl=[1,62],$Vm=[1,56],$Vn=[1,57],$Vo=[1,58],$Vp=[1,59],$Vq=[1,60],$Vr=[1,61],$Vs=[12,20,23,30,33,42,45,46,47,48,49,50],$Vt=[1,66],$Vu=[23,30],$Vv=[16,30,33],$Vw=[1,87],$Vx=[12,20,23,30,33,45,46,48,49,50],$Vy=[12,20,23,30,33,45,46,47,48,49,50],$Vz=[12,20,23,30,33,50];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Program":3,"StatementList":4,"ENDOFFILE":5,"Statement":6,"FunctionDefinition":7,"Block":8,"Assignment":9,"LanguageBlockAssignment":10,"FunctionCall":11,"SEMICOLON":12,"IfStatement":13,"ReturnStatement":14,"TypedIdentifier":15,"ASSIGN":16,"LanguageBlock":17,"LBRACKET":18,"ASSOCIATIVE":19,"RBRACKET":20,"IMPERATIVE":21,"LBRACE":22,"RBRACE":23,"RETURN":24,"Expression":25,"DEF":26,"Identifier":27,"LPAREN":28,"IdentifierList":29,"RPAREN":30,"IF":31,"ELSE":32,"COMMA":33,"ID":34,"COLON":35,"Type":36,"ExpressionList":37,"Literal":38,"BinaryExpression":39,"RangeExpression":40,"ReplicationGuideList":41,"DOTDOT":42,"CountExpression":43,"POUND":44,"PLUS":45,"MINUS":46,"TIMES":47,"EQUALITY":48,"RCARET":49,"OR":50,"ReplicationGuide":51,"LCARET":52,"NUMBER":53,"TRUE":54,"FALSE":55,"STRING":56,"$accept":0,"$end":1},
terminals_: {2:"error",5:"ENDOFFILE",12:"SEMICOLON",16:"ASSIGN",18:"LBRACKET",19:"ASSOCIATIVE",20:"RBRACKET",21:"IMPERATIVE",22:"LBRACE",23:"RBRACE",24:"RETURN",26:"DEF",28:"LPAREN",30:"RPAREN",31:"IF",32:"ELSE",33:"COMMA",34:"ID",35:"COLON",42:"DOTDOT",44:"POUND",45:"PLUS",46:"MINUS",47:"TIMES",48:"EQUALITY",49:"RCARET",50:"OR",52:"LCARET",53:"NUMBER",54:"TRUE",55:"FALSE",56:"STRING"},
productions_: [0,[3,2],[4,2],[4,0],[6,1],[6,1],[6,1],[6,1],[6,2],[6,1],[6,1],[10,3],[17,4],[17,4],[8,3],[14,4],[14,3],[7,8],[9,4],[13,5],[13,7],[29,3],[29,1],[29,0],[27,1],[15,1],[15,3],[36,1],[37,3],[37,1],[37,0],[25,1],[25,1],[25,1],[25,1],[25,1],[25,2],[25,3],[25,4],[40,3],[40,5],[40,6],[43,1],[43,1],[43,1],[43,3],[43,4],[39,3],[39,3],[39,3],[39,3],[39,3],[39,3],[51,3],[41,1],[41,2],[11,4],[38,1],[38,1],[38,1],[38,1],[38,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2:
 this.$ = recordState( new yy.StatementListNode( $$[$0-1], $$[$0] ), this._$); 
break;
case 3:
 this.$ = recordState( new yy.StatementListNode(), this._$); 
break;
case 11: case 16:
 this.$ = recordState( new yy.AssignmentNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 12:
 this.$ = recordState( new yy.AssociativeBlockNode( $$[$0] ), this._$);  
break;
case 13:
 this.$ = recordState( new yy.ImperativeBlockNode( $$[$0] ), this._$);  
break;
case 14: case 37: case 45:
 this.$ = $$[$0-1]; 
break;
case 15: case 18:
 this.$ = recordState( new yy.AssignmentNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 17:
 this.$ = recordState( new yy.FunctionDefinitionNode( $$[$0-6], $$[$0-4], $$[$0-1]), this._$); 
break;
case 19:
 this.$ = recordState( new yy.IfStatementNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 20:
 this.$ = recordState( new yy.IfStatementNode( $$[$0-4], $$[$0-2], $$[$0] ), this._$); 
break;
case 21:
 this.$ = recordState( new yy.IdentifierListNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 22:
 this.$ = recordState( new yy.IdentifierListNode( $$[$0] ), this._$); 
break;
case 24:
 this.$ = recordState( new yy.IdentifierNode($$[$0]), this._$); 
break;
case 26:
 this.$ = recordState( new yy.IdentifierNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 27:
 this.$ = recordState( new yy.Type( $$[$0] ), this._$); 
break;
case 28:
 this.$ = recordState( new yy.ExpressionListNode($$[$0-2], $$[$0]), this._$); 
break;
case 29:
 this.$ = recordState( new yy.ExpressionListNode($$[$0]), this._$); 
break;
case 36:
 this.$ = recordState( new yy.ReplicationExpressionNode($$[$0-1], $$[$0]), this._$); 
break;
case 38: case 46:
 this.$ = recordState( new yy.ArrayIndexNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 39:
 this.$ = recordState( new yy.RangeExpressionNode($$[$0-2], $$[$0]), this._$); 
break;
case 40:
 this.$ = recordState( new yy.RangeExpressionNode($$[$0-4], $$[$0-2], $$[$0]), this._$); 
break;
case 41:
 this.$ = recordState( new yy.RangeExpressionNode($$[$0-5], $$[$0-3], $$[$0], true), this._$); 
break;
case 47: case 48:
 this.$ = recordState( new yy.BinaryExpressionNode($$[$0-1] ,$$[$0-2], $$[$0]), this._$); 
break;
case 49: case 50: case 51: case 52:
 this.$ = recordState( new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]), this._$); 
break;
case 53:
 this.$ = recordState( new yy.ReplicationGuideNode( $$[$0-1] ), this._$); 
break;
case 54:
 this.$ = recordState( new yy.ReplicationGuideListNode( $$[$0] ), this._$); 
break;
case 55:
 this.$ = recordState( new yy.ReplicationGuideListNode( $$[$0-1], $$[$0] ), this._$); 
break;
case 56:
 this.$ = recordState( new yy.FunctionCallNode($$[$0-3], $$[$0-1]), this._$); 
break;
case 57:
 this.$ = recordState( new yy.NumberNode( $$[$0] ), this._$); 
break;
case 58: case 59:
 this.$ = recordState( new yy.BooleanNode( $$[$0] ), this._$); 
break;
case 60:
 this.$ = recordState( new yy.StringNode( $$[$0] ), this._$); 
break;
case 61:
 this.$ = recordState( new yy.ArrayNode( $$[$0-1] ), this._$); 
break;
}
},
table: [{3:1,4:2,5:$V0,6:3,7:4,8:5,9:6,10:7,11:8,13:9,14:10,15:13,22:$V1,24:$V2,26:$V3,27:14,31:$V4,34:$V5},{1:[3]},{5:[1,18]},o($V6,$V0,{6:3,7:4,8:5,9:6,10:7,11:8,13:9,14:10,15:13,27:14,4:19,22:$V1,24:$V2,26:$V3,31:$V4,34:$V5}),o($V7,[2,4]),o($V7,[2,5]),o($V7,[2,6]),o($V7,[2,7]),{12:[1,20]},o($V7,[2,9]),o($V7,[2,10]),{27:21,34:$V8},{4:23,6:3,7:4,8:5,9:6,10:7,11:8,13:9,14:10,15:13,22:$V1,23:$V0,24:$V2,26:$V3,27:14,31:$V4,34:$V5},{16:[1,24]},{16:$V9,28:$Va},{28:[1,26]},{16:[1,27]},o([16,28,30,33],$Vb,{35:[1,28]}),{1:[2,1]},o($V6,[2,2]),o($V7,[2,8]),{28:[1,29]},o([12,18,20,23,28,30,33,42,45,46,47,48,49,50,52],$Vb),{23:[1,30]},{11:35,17:32,18:$Vc,22:$Vd,25:31,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:46,27:34,28:$Ve,30:$Vj,34:$V8,37:45,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:47,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,17:49,18:$Vc,22:$Vd,25:48,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{34:[1,51],36:50},{15:53,27:54,29:52,30:$Vk,34:$V5},o([5,22,23,24,26,31,32,34],[2,14]),{12:[1,55],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},o($V7,[2,11]),o($Vs,[2,31]),o($Vs,[2,32],{41:63,51:65,18:[1,64],28:$Va,52:$Vt}),o($Vs,[2,33]),o($Vs,[2,34]),o($Vs,[2,35]),{11:35,22:$Vd,25:67,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{19:[1,68],21:[1,69]},o($Vs,[2,57]),o($Vs,[2,58]),o($Vs,[2,59]),o($Vs,[2,60]),{11:35,22:$Vd,23:$Vj,25:46,27:34,28:$Ve,34:$V8,37:70,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{30:[1,71]},o($Vu,[2,29],{33:[1,72],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr}),{30:[1,73],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},{12:[1,74],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},o($V7,[2,16]),o($Vv,[2,26]),o($Vv,[2,27]),{30:[1,75]},{30:[2,22],33:[1,76]},o([30,33],$V9),o($V7,[2,18]),{11:35,22:$Vd,25:77,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:78,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:79,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:80,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:81,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:82,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:86,22:$Vd,27:85,28:$Vw,34:$V8,38:84,43:83,53:$Vf,54:$Vg,55:$Vh,56:$Vi},o($Vs,[2,36]),{11:35,22:$Vd,25:88,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},o($Vs,[2,54],{51:65,41:89,52:$Vt}),{11:35,22:$Vd,25:90,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{30:[1,91],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},{20:[1,92]},{20:[1,93]},{23:[1,94]},o($Vs,[2,56]),o($Vu,$Vj,{38:33,27:34,11:35,39:36,40:37,25:46,37:95,22:$Vd,28:$Ve,34:$V8,53:$Vf,54:$Vg,55:$Vh,56:$Vi}),{8:96,22:$V1},o($V7,[2,15]),{22:[1,97]},{15:53,27:54,29:98,30:$Vk,34:$V5},o($Vx,[2,47],{42:$Vl,47:$Vo}),o($Vx,[2,48],{42:$Vl,47:$Vo}),o($Vy,[2,49],{42:$Vl}),o($Vz,[2,50],{42:$Vl,45:$Vm,46:$Vn,47:$Vo}),o($Vz,[2,51],{42:$Vl,45:$Vm,46:$Vn,47:$Vo}),o($Vz,[2,52],{42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq}),o($Vy,[2,39],{42:[1,99]}),o($Vs,[2,42]),o($Vs,[2,43],{18:[1,100],28:$Va}),o($Vs,[2,44]),{11:35,22:$Vd,25:101,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{20:[1,102],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},o($Vs,[2,55]),{42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:[1,103],50:$Vr},o($Vs,[2,37]),{8:104,22:$V1},{8:105,22:$V1},o($Vs,[2,61]),o($Vu,[2,28]),o($V7,[2,19],{32:[1,106]}),{4:107,6:3,7:4,8:5,9:6,10:7,11:8,13:9,14:10,15:13,22:$V1,23:$V0,24:$V2,26:$V3,27:14,31:$V4,34:$V5},{30:[2,21]},{11:86,22:$Vd,27:85,28:$Vw,34:$V8,38:84,43:108,44:[1,109],53:$Vf,54:$Vg,55:$Vh,56:$Vi},{11:35,22:$Vd,25:110,27:34,28:$Ve,34:$V8,38:33,39:36,40:37,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{30:[1,111],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},o($Vs,[2,38]),o([12,20,23,30,33,42,45,46,47,48,49,50,52],[2,53],{38:33,27:34,11:35,39:36,40:37,25:81,22:$Vd,28:$Ve,34:$V8,53:$Vf,54:$Vg,55:$Vh,56:$Vi}),o($V7,[2,12]),o($V7,[2,13]),{6:112,7:4,8:5,9:6,10:7,11:8,13:9,14:10,15:13,22:$V1,24:$V2,26:$V3,27:14,31:$V4,34:$V5},{23:[1,113]},o($Vs,[2,40]),{11:86,22:$Vd,27:85,28:$Vw,34:$V8,38:84,43:114,53:$Vf,54:$Vg,55:$Vh,56:$Vi},{20:[1,115],42:$Vl,45:$Vm,46:$Vn,47:$Vo,48:$Vp,49:$Vq,50:$Vr},o($Vs,[2,45]),o($V7,[2,20]),o($V7,[2,17]),o($Vs,[2,41]),o($Vs,[2,46])],
defaultActions: {18:[2,1],98:[2,21]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        function lex() {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    function recordState( node, state ){
		node.parserState = {
	        firstLine : state.first_line,
		    lastLine : state.last_line,
		    firstCol : state.first_column,
		    lastCol : state.last_column
		}

        return node;
    }
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore comment */
break;
case 1:return 31;
break;
case 2:return 32;
break;
case 3:return 26;
break;
case 4:return 'VAR';
break;
case 5:return 'VARRANGE';
break;
case 6:return 'NUL';
break;
case 7:return 54;
break;
case 8:return 55;
break;
case 9:return 21;
break;
case 10:return 19;
break;
case 11:return 24;
break;
case 12:return 53;
break;
case 13:return 34;
break;
case 14:return 56;
break;
case 15:return 48;
break;
case 16:return 16;
break;
case 17:return 45;
break;
case 18:return 46;
break;
case 19:return 47;
break;
case 20:return 35;
break;
case 21:return 42;
break;
case 22:return 44;
break;
case 23:return 33;
break;
case 24:return 52;
break;
case 25:return 49;
break;
case 26:return 50;
break;
case 27:return 'NOT';
break;
case 28:return 'DOT';
break;
case 29:return 22;
break;
case 30:return 23;
break;
case 31:return 28;
break;
case 32:return 30;
break;
case 33:return 18;
break;
case 34:return 20;
break;
case 35:return 12;
break;
case 36:/* skip whitespace */
break;
case 37:throw 'Illegal character';
break;
case 38:return 5;
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:def\b)/,/^(?:var\b)/,/^(?:var\[\]\.\.\[\])/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:Imperative\b)/,/^(?:Associative\b)/,/^(?:return\b)/,/^(?:([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?))/,/^(?:([a-zA-Z][a-zA-Z0-9]*(\[\])*))/,/^(?:"([a-zA-Z0-9\s]*)")/,/^(?:==)/,/^(?:=)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?::)/,/^(?:\.\.)/,/^(?:#)/,/^(?:,)/,/^(?:<)/,/^(?:>)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:\s+)/,/^(?:\.)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"_process":12,"fs":10,"path":11}],6:[function(require,module,exports){
var Range = (function () {
    function Range() {
    }
    Range.byStartEnd = function (start, end) {
        return Range.byStepSize(start, end, start < end ? 1.0 : -1.0);
    };
    Range.byStepSize = function (start, end, stepSize) {
        if (Math.abs(stepSize) <= 1e-12)
            throw new Error('The step size is too small.');
        if ((stepSize < 0 && (end - start) > 0) ||
            (stepSize > 0 && (end - start) < 0))
            throw new Error('The step size will not be able to cover the range.');
        var stepCount = Math.ceil(Math.abs((end - start) / stepSize)) + 1;
        return Range.byStepCount(start, end, stepCount);
    };
    Range.byStepCount = function (start, end, steps) {
        if (steps <= 0)
            throw new Error('The step count must be greater than 0.');
        if (Math.abs(end - start) < 1e-12)
            throw new Error('The difference between the two ends of the range is too small.');
        var range = [];
        var stepSize = (end - start) / (steps - 1);
        for (var i = 0; i < steps - 1; i++) {
            range.push(start + i * stepSize);
        }
        range.push(end);
        return range;
    };
    return Range;
})();
exports.Range = Range;

},{}],7:[function(require,module,exports){
var Types_1 = require("./Types");
var Replicator = (function () {
    function Replicator() {
    }
    Replicator.replicate = function (fd, args, repGuides) {
        if (!repGuides) {
            repGuides = new Array(args.length);
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof Types_1.ReplicatedExpression) {
                    args[i] = arg.value;
                    repGuides[i] = arg.replicationGuides[0];
                }
                else {
                    repGuides[i] = 1;
                }
            }
        }
        var expectedTypes = fd.argumentTypes.map(function (x) { return x.typeName; });
        if (Replicator.allTypesMatch(args, expectedTypes)) {
            return fd.func.apply(undefined, args);
        }
        var sortedRepGuides = repGuides ? Replicator.sortRepGroups(repGuides, args.length) : [Replicator.range(args.length)];
        return Replicator.replicateCore(fd, args, expectedTypes, sortedRepGuides, 0);
    };
    Replicator.replicateCore = function (fd, args, expectedTypes, sortedRepGuides, curRepGuide) {
        var isTypeMatch = Replicator.allTypesMatch(args, expectedTypes);
        // are we at the the last replication guide and matching
        if (curRepGuide > sortedRepGuides.length - 1) {
            if (isTypeMatch) {
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure: " + "Expected " + expectedTypes + args);
        }
        var results = [];
        var s = sortedRepGuides[curRepGuide];
        var minLen = s.reduce(function (a, x) { return (args[x] instanceof Array) ? Math.min(args[x].length, a) : a; }, Number.MAX_VALUE);
        var i, j, l2;
        for (i = 0; i < minLen; i++) {
            var curargs = [];
            for (j = 0, l2 = args.length; j < l2; j++) {
                if (s.indexOf(j) > -1 && args[j] instanceof Array) {
                    if (args[j].length > minLen) {
                        curargs.push(args[j][minLen - 1]);
                    }
                    else {
                        curargs.push(args[j][i]);
                    }
                }
                else {
                    curargs.push(args[j]);
                }
            }
            results.push(Replicator.replicateCore(fd, curargs, expectedTypes, sortedRepGuides, curRepGuide + 1));
        }
        return results;
    };
    Replicator.range = function (t) {
        var a = [];
        for (var i = 0; i < t; i++)
            a.push(i);
        return a;
    };
    Replicator.repeat = function (t, v) {
        var a = [];
        for (var i = 0; i < t; i++)
            a.push(v);
        return a;
    };
    Replicator.sortRepGroups = function (repGuides, argCount) {
        var m = Math.max.apply(undefined, repGuides);
        if (m > argCount) {
            throw new Error("Replication guide cannot be larger than the number of arguments!");
        }
        var i, sorted = [];
        for (i = 0; i < m; i++)
            sorted.push([]);
        for (i = 0; i < repGuides.length; i++) {
            if (repGuides[i] - 1 < 0)
                throw new Error("Replication guide must be greater than 0");
            sorted[repGuides[i] - 1].push(i);
        }
        for (i = 0; i < sorted.length; i++) {
            if (sorted[i].length === 0)
                throw new Error("Invalid replication guides");
        }
        return sorted;
    };
    Replicator.allTypesMatch = function (args, expectedTypes) {
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
            if (!Replicator.isTypeMatch(args[i], expectedTypes[i])) {
                return false;
            }
        }
        return true;
    };
    Replicator.isTypeMatch = function (arg, typeName) {
        if (typeName === void 0) { typeName = "var"; }
        if (arg === undefined || arg === null)
            return false;
        if (typeName === "var" && arg.constructor != Array ||
            typeName === "var[]..[]" ||
            typeof arg === typeName) {
            return true;
        }
        // generic arrays like Foo[][]
        while (arg != undefined && arg != null && typeName.indexOf('[]') != -1 && arg.constructor === Array) {
            arg = arg[0];
            typeName = typeName.slice(0, -2);
            if (typeof arg === typeName)
                return true;
        }
        return false;
    };
    return Replicator;
})();
exports.Replicator = Replicator;

},{"./Types":8}],8:[function(require,module,exports){
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
        if (typeName === void 0) { typeName = 'var'; }
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

},{}],9:[function(require,module,exports){
var Parser = require('./Parser')
	, Interpreter = require('./AssociativeInterpreter').AssociativeInterpreter
	, TypedFunction = require('./Types').TypedFunction
	, TypedArgument = require('./Types').TypedArgument;

var ast = require('./AST');
Parser.parser.yy = ast;

function run(p){
	var pp = Parser.parse( p );
	(new Interpreter()).eval( pp );
}

module.exports = 
{
    Parser : Parser.parser,
    Interpreter : Interpreter,
    TypedFunction : TypedFunction,
    TypedArgument : TypedArgument,
    run : run
};

},{"./AST":1,"./AssociativeInterpreter":2,"./Parser":5,"./Types":8}],10:[function(require,module,exports){

},{}],11:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[9])(9)
});