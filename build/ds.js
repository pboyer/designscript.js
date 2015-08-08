(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ds = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
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
            this.head.toString() + ", " + this.tail.toString();
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
        return this.type ? this.name + " : " + this.type.toString() : this.name;
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
        this.value = value === "true";
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
        return "{ " + this.expressionList.toString() + " }";
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
        return this.firstExpression.toString() + " " + this.operator + " " + this.secondExpression.toString();
    };
    BinaryExpressionNode.prototype.accept = function (v) {
        return v.visitBinaryExpressionNode(this);
    };
    return BinaryExpressionNode;
})(Node);
exports.BinaryExpressionNode = BinaryExpressionNode;
var FunctionCallNode = (function (_super) {
    __extends(FunctionCallNode, _super);
    function FunctionCallNode(fid, el) {
        _super.call(this);
        this.functionId = fid;
        this.arguments = el;
    }
    FunctionCallNode.prototype.toString = function () {
        return this.functionId.toString() + "( " + this.arguments.toString() + " )";
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
        return this.array.toString() + "[ " + this.index.toString() + " ]";
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
            s = s + ", ";
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
        return "<" + this.index.toString() + ">";
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
        return this.toLines("").join("\n");
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
        return [indent + "[" + this.name + "]{"]
            .concat(this.statementList.toLines(indent + "\t"))
            .concat([indent + "}"]);
    };
    return LanguageBlockNode;
})(StatementNode);
exports.LanguageBlockNode = LanguageBlockNode;
var AssociativeBlockNode = (function (_super) {
    __extends(AssociativeBlockNode, _super);
    function AssociativeBlockNode(sl) {
        _super.call(this, "Associative", sl);
    }
    return AssociativeBlockNode;
})(LanguageBlockNode);
exports.AssociativeBlockNode = AssociativeBlockNode;
var ImperativeBlockNode = (function (_super) {
    __extends(ImperativeBlockNode, _super);
    function ImperativeBlockNode(sl) {
        _super.call(this, "Imperative", sl);
    }
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
        return [indent + "if( " + this.testExpression.toString() + " ){"]
            .concat(this.trueStatementList.toLines(indent + "\t"))
            .concat([indent + " } else { "])
            .concat(this.falseStatementList.toLines(indent + "\t"));
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
        return [indent + "def " + this.identifier.toString() + "( " + this.arguments.toString() + " ){"]
            .concat(this.body.toLines("\t" + indent))
            .concat([indent + "}"]);
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
        return [indent + this.identifier.toString() + " = " + this.expression.toString() + ";"];
    };
    AssignmentNode.prototype.accept = function (v) {
        return v.visitAssignmentNode(this);
    };
    return AssignmentNode;
})(StatementNode);
exports.AssignmentNode = AssignmentNode;
var ReturnNode = (function (_super) {
    __extends(ReturnNode, _super);
    function ReturnNode(e) {
        _super.call(this);
        this.expression = e;
    }
    ReturnNode.prototype.toLines = function (indent) {
        return [indent + "return = " + this.expression.toString() + ";"];
    };
    ReturnNode.prototype.accept = function (v) {
        return v.visitReturnNode(this);
    };
    return ReturnNode;
})(StatementNode);
exports.ReturnNode = ReturnNode;

},{}],2:[function(require,module,exports){
var Parser = require('./parser')
	, Interpreter = require('./imperative').Interpreter
	, TypedFunction = require('./types').TypedFunction
	, TypedArgument = require('./types').TypedArgument;

var ast = require('./ast');
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
}

},{"./ast":1,"./imperative":4,"./parser":5,"./types":7}],3:[function(require,module,exports){
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
        throw new Error(id + " is an unbound identifier!");
    };
    Environment.prototype.set = function (id, val) {
        this.dict[id] = val;
    };
    return Environment;
})();
exports.Environment = Environment;

},{}],4:[function(require,module,exports){
var enviro = require('./environment');
var ast = require('./ast');
var types = require('./types');
var replicator = require('./replicator');
var Interpreter = (function () {
    function Interpreter(extensions) {
        this.replicator = new replicator.Replicator();
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
        e.set("print", new types.TypedFunction(function (x) { return console.log(x); }, [new types.TypedArgument("a")], "print"));
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
        return this.replicator.replicate(fd, e.arguments.accept(this));
    };
    Interpreter.prototype.visitReplicationExpressionNode = function (fa) {
        return new types.ReplicatedExpression(fa.expression.accept(this), fa.replicationGuideList);
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
            val.push(new types.TypedArgument(il.head.name, t ? t.name : undefined));
            il = il.tail;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        fd = new types.TypedFunction(f, val, fds.identifier.name);
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
    Interpreter.prototype.visitImperativeBlockNode = function (node) { throw new Error("Not implemented"); };
    ;
    Interpreter.prototype.visitAssociativeBlockNode = function (node) { throw new Error("Not implemented"); };
    ;
    return Interpreter;
})();
exports.Interpreter = Interpreter;

},{"./ast":1,"./environment":3,"./replicator":6,"./types":7}],5:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,3],$V1=[1,17],$V2=[1,12],$V3=[1,16],$V4=[1,11],$V5=[1,15],$V6=[1,18],$V7=[5,20],$V8=[5,15,19,20,21,24,30,33],$V9=[1,23],$Va=[2,23],$Vb=[1,26],$Vc=[2,22],$Vd=[1,44],$Ve=[1,39],$Vf=[1,40],$Vg=[1,41],$Vh=[1,42],$Vi=[1,43],$Vj=[2,28],$Vk=[2,21],$Vl=[1,57],$Vm=[1,58],$Vn=[1,59],$Vo=[1,60],$Vp=[1,61],$Vq=[1,62],$Vr=[11,17,20,28,32,40,41,42,43,44,45],$Vs=[1,66],$Vt=[20,28],$Vu=[22,28,32],$Vv=[11,17,20,28,32,40,41,43,44,45],$Vw=[11,17,20,28,32,45];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Program":3,"StatementList":4,"ENDOFFILE":5,"Statement":6,"FunctionDefinition":7,"Block":8,"Assignment":9,"FunctionCall":10,"SEMICOLON":11,"IfStatement":12,"ReturnStatement":13,"LanguageBlock":14,"LBRACKET":15,"ASSOCIATIVE":16,"RBRACKET":17,"IMPERATIVE":18,"LBRACE":19,"RBRACE":20,"RETURN":21,"ASSIGN":22,"Expression":23,"DEF":24,"Identifier":25,"LPAREN":26,"IdentifierList":27,"RPAREN":28,"TypedIdentifier":29,"IF":30,"ELSE":31,"COMMA":32,"ID":33,"COLON":34,"Type":35,"ExpressionList":36,"Literal":37,"BinaryExpression":38,"ReplicationGuideList":39,"PLUS":40,"MINUS":41,"TIMES":42,"EQUALITY":43,"RCARET":44,"OR":45,"ReplicationGuide":46,"LCARET":47,"NUMBER":48,"TRUE":49,"FALSE":50,"STRING":51,"$accept":0,"$end":1},
terminals_: {2:"error",5:"ENDOFFILE",11:"SEMICOLON",15:"LBRACKET",16:"ASSOCIATIVE",17:"RBRACKET",18:"IMPERATIVE",19:"LBRACE",20:"RBRACE",21:"RETURN",22:"ASSIGN",24:"DEF",26:"LPAREN",28:"RPAREN",30:"IF",31:"ELSE",32:"COMMA",33:"ID",34:"COLON",40:"PLUS",41:"MINUS",42:"TIMES",43:"EQUALITY",44:"RCARET",45:"OR",47:"LCARET",48:"NUMBER",49:"TRUE",50:"FALSE",51:"STRING"},
productions_: [0,[3,2],[4,2],[4,0],[6,1],[6,1],[6,1],[6,2],[6,1],[6,1],[6,1],[14,4],[14,4],[8,3],[13,4],[7,8],[9,4],[12,5],[12,7],[27,3],[27,1],[27,0],[25,1],[29,1],[29,3],[35,1],[36,3],[36,1],[36,0],[23,1],[23,1],[23,1],[23,1],[23,2],[23,3],[23,4],[38,3],[38,3],[38,3],[38,3],[38,3],[38,3],[46,3],[39,1],[39,2],[10,4],[37,1],[37,1],[37,1],[37,1],[37,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return $$[$0-1]; 
break;
case 2:
 this.$ = record( new yy.StatementListNode( $$[$0-1], $$[$0] ), this._$); 
break;
case 3:
 this.$ = record( new yy.StatementListNode(), this._$); 
break;
case 11:
 this.$ = record( new yy.AssociativeBlockNode( $$[$0] ), this._$);  
break;
case 12:
 this.$ = record( new yy.ImperativeBlockNode( $$[$0] ), this._$);  
break;
case 13: case 34:
 this.$ = $$[$0-1]; 
break;
case 14:
 this.$ = record( new yy.ReturnNode( $$[$0-1] ), this._$); 
break;
case 15:
 this.$ = record( new yy.FunctionDefinitionNode( $$[$0-6], $$[$0-4], $$[$0-1]), this._$); 
break;
case 16:
 this.$ = record( new yy.AssignmentNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 17:
 this.$ = record( new yy.IfStatementNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 18:
 this.$ = record( new yy.IfStatementNode( $$[$0-4], $$[$0-2], $$[$0] ), this._$); 
break;
case 19:
 this.$ = record( new yy.IdentifierListNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 20:
 this.$ = record( new yy.IdentifierListNode( $$[$0] ), this._$); 
break;
case 22:
 this.$ = record( new yy.IdentifierNode($$[$0]), this._$); 
break;
case 24:
 this.$ = record( new yy.IdentifierNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 25:
 this.$ = record( new yy.Type( $$[$0] ), this._$); 
break;
case 26:
 this.$ = record( new yy.ExpressionListNode($$[$0-2], $$[$0]), this._$); 
break;
case 27:
 this.$ = record( new yy.ExpressionListNode($$[$0]), this._$); 
break;
case 33:
 this.$ = record( new yy.ReplicationExpressionNode($$[$0-1], $$[$0]), this._$); 
break;
case 35:
 this.$ = record( new yy.ArrayIndexNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 36: case 37:
 this.$ = record( new yy.BinaryExpressionNode($$[$0-1] ,$$[$0-2], $$[$0]), this._$); 
break;
case 38: case 39: case 40: case 41:
 this.$ = record( new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]), this._$); 
break;
case 42:
 this.$ = record( new yy.ReplicationGuideNode( $$[$0-1] ), this._$); 
break;
case 43:
 this.$ = record( new yy.ReplicationGuideListNode( $$[$0] ), this._$); 
break;
case 44:
 this.$ = record( new yy.ReplicationGuideListNode( $$[$0-1], $$[$0] ), this._$); 
break;
case 45:
 this.$ = record( new yy.FunctionCallNode($$[$0-3], $$[$0-1]), this._$); 
break;
case 46:
 this.$ = record( new yy.NumberNode( $$[$0] ), this._$); 
break;
case 47: case 48:
 this.$ = record( new yy.BooleanNode( $$[$0] ), this._$); 
break;
case 49:
 this.$ = record( new yy.StringNode( $$[$0] ), this._$); 
break;
case 50:
 this.$ = record( new yy.ArrayNode( $$[$0-1] ), this._$); 
break;
}
},
table: [{3:1,4:2,5:$V0,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:10,15:$V1,19:$V2,21:$V3,24:$V4,25:14,29:13,30:$V5,33:$V6},{1:[3]},{5:[1,19]},o($V7,$V0,{6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:10,29:13,25:14,4:20,15:$V1,19:$V2,21:$V3,24:$V4,30:$V5,33:$V6}),o($V8,[2,4]),o($V8,[2,5]),o($V8,[2,6]),{11:[1,21]},o($V8,[2,8]),o($V8,[2,9]),o($V8,[2,10]),{25:22,33:$V9},{4:24,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:10,15:$V1,19:$V2,20:$V0,21:$V3,24:$V4,25:14,29:13,30:$V5,33:$V6},{22:[1,25]},{22:$Va,26:$Vb},{26:[1,27]},{22:[1,28]},{16:[1,29],18:[1,30]},o([22,26,28,32],$Vc,{34:[1,31]}),{1:[2,1]},o($V7,[2,2]),o($V8,[2,7]),{26:[1,32]},o([11,15,17,20,26,28,32,40,41,42,43,44,45,47],$Vc),{20:[1,33]},{10:37,19:$Vd,23:34,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:46,25:36,26:$Ve,28:$Vj,33:$V9,36:45,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:47,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:48,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{17:[1,49]},{17:[1,50]},{33:[1,52],35:51},{25:55,27:53,28:$Vk,29:54,33:$V6},o([5,15,19,20,21,24,30,31,33],[2,13]),{11:[1,56],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq},o($Vr,[2,29]),o($Vr,[2,30],{39:63,46:65,15:[1,64],26:$Vb,47:$Vs}),o($Vr,[2,31]),o($Vr,[2,32]),{10:37,19:$Vd,23:67,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},o($Vr,[2,46]),o($Vr,[2,47]),o($Vr,[2,48]),o($Vr,[2,49]),{10:37,19:$Vd,20:$Vj,23:46,25:36,26:$Ve,33:$V9,36:68,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{28:[1,69]},o($Vt,[2,27],{32:[1,70],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq}),{28:[1,71],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq},{11:[1,72],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq},{8:73,19:$V2},{8:74,19:$V2},o($Vu,[2,24]),o($Vu,[2,25]),{28:[1,75]},{28:[2,20],32:[1,76]},o([28,32],$Va),o($V8,[2,16]),{10:37,19:$Vd,23:77,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:78,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:79,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:80,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:81,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{10:37,19:$Vd,23:82,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},o($Vr,[2,33]),{10:37,19:$Vd,23:83,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},o($Vr,[2,43],{46:65,39:84,47:$Vs}),{10:37,19:$Vd,23:85,25:36,26:$Ve,33:$V9,37:35,38:38,48:$Vf,49:$Vg,50:$Vh,51:$Vi},{28:[1,86],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq},{20:[1,87]},o($Vr,[2,45]),o($Vt,$Vj,{37:35,25:36,10:37,38:38,23:46,36:88,19:$Vd,26:$Ve,33:$V9,48:$Vf,49:$Vg,50:$Vh,51:$Vi}),{8:89,19:$V2},o($V8,[2,14]),o($V8,[2,11]),o($V8,[2,12]),{19:[1,90]},{25:55,27:91,28:$Vk,29:54,33:$V6},o($Vv,[2,36],{42:$Vn}),o($Vv,[2,37],{42:$Vn}),o($Vr,[2,38]),o($Vw,[2,39],{40:$Vl,41:$Vm,42:$Vn}),o($Vw,[2,40],{40:$Vl,41:$Vm,42:$Vn}),o($Vw,[2,41],{40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp}),{17:[1,92],40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:$Vp,45:$Vq},o($Vr,[2,44]),{40:$Vl,41:$Vm,42:$Vn,43:$Vo,44:[1,93],45:$Vq},o($Vr,[2,34]),o($Vr,[2,50]),o($Vt,[2,26]),o($V8,[2,17],{31:[1,94]}),{4:95,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:10,15:$V1,19:$V2,20:$V0,21:$V3,24:$V4,25:14,29:13,30:$V5,33:$V6},{28:[2,19]},o($Vr,[2,35]),o([11,17,20,28,32,40,41,42,43,44,45,47],[2,42],{37:35,25:36,10:37,38:38,23:81,19:$Vd,26:$Ve,33:$V9,48:$Vf,49:$Vg,50:$Vh,51:$Vi}),{6:96,7:4,8:5,9:6,10:7,12:8,13:9,14:10,15:$V1,19:$V2,21:$V3,24:$V4,25:14,29:13,30:$V5,33:$V6},{20:[1,97]},o($V8,[2,18]),o($V8,[2,15])],
defaultActions: {19:[2,1],91:[2,19]},
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

    function record( node, state ){
        node.firstLine = state.first_line;
        node.lastLine = state.last_line;
        node.firstCol = state.first_column;
        node.lastCol = state.last_column;
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
case 1:return 30;
break;
case 2:return 31;
break;
case 3:return 24;
break;
case 4:return 'VAR';
break;
case 5:return 'VARRANGE';
break;
case 6:return 'NUL';
break;
case 7:return 49;
break;
case 8:return 50;
break;
case 9:return 18;
break;
case 10:return 16;
break;
case 11:return 21;
break;
case 12:return 48;
break;
case 13:return 33;
break;
case 14:return 51;
break;
case 15:return 43;
break;
case 16:return 22;
break;
case 17:return 40;
break;
case 18:return 41;
break;
case 19:return 42;
break;
case 20:return 34;
break;
case 21:return 32;
break;
case 22:return 47;
break;
case 23:return 44;
break;
case 24:return 45;
break;
case 25:return 'NOT';
break;
case 26:return 'DOT';
break;
case 27:return 19;
break;
case 28:return 20;
break;
case 29:return 26;
break;
case 30:return 28;
break;
case 31:return 15;
break;
case 32:return 17;
break;
case 33:return 11;
break;
case 34:/* skip whitespace */
break;
case 35:throw 'Illegal character';
break;
case 36:return 5;
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:def\b)/,/^(?:var\b)/,/^(?:var\[\]\.\.\[\])/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:Imperative\b)/,/^(?:Associative\b)/,/^(?:return\b)/,/^(?:([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?))/,/^(?:([a-zA-Z][a-zA-Z0-9\.]*(\[\])*))/,/^(?:"([a-zA-Z0-9\s]*)")/,/^(?:==)/,/^(?:=)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?::)/,/^(?:,)/,/^(?:<)/,/^(?:>)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:\s+)/,/^(?:\.)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],"inclusive":true}}
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
},{"_process":10,"fs":8,"path":9}],6:[function(require,module,exports){
var Replicator = (function () {
    function Replicator() {
    }
    Replicator.prototype.replicate = function (fd, args) {
        var expectedTypes = fd.argumentTypes.map(function (x) { return x.typeName; });
        if (this.allTypesMatch(args, expectedTypes)) {
            return fd.func.apply(undefined, args);
        }
    };
    Replicator.prototype.isObjectTypeMatch = function (arg, typeName) {
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
    Replicator.prototype.allTypesMatch = function (args, expectedTypes) {
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
    return Replicator;
})();
exports.Replicator = Replicator;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){

},{}],9:[function(require,module,exports){
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
},{"_process":10}],10:[function(require,module,exports){
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

},{}]},{},[2])(2)
});