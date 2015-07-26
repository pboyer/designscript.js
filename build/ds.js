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
        this.id = id;
        this.il = il;
    }
    IdentifierListNode.prototype.toString = function () {
        return this.il == null ?
            this.id.toString() :
            this.id.toString() + ", " + this.il.toString();
    };
    IdentifierListNode.prototype.accept = function (v) {
        return v.visitIdentifierListNode(this);
    };
    return IdentifierListNode;
})(Node);
exports.IdentifierListNode = IdentifierListNode;
var IdentifierNode = (function (_super) {
    __extends(IdentifierNode, _super);
    function IdentifierNode(id) {
        _super.call(this);
        this.id = id;
    }
    IdentifierNode.prototype.toString = function () {
        return this.id;
    };
    IdentifierNode.prototype.accept = function (v) {
        return v.visitIdentifierNode(this);
    };
    return IdentifierNode;
})(Node);
exports.IdentifierNode = IdentifierNode;
var TypedIdentifierNode = (function (_super) {
    __extends(TypedIdentifierNode, _super);
    function TypedIdentifierNode(id, t) {
        _super.call(this, id);
        this.t = t;
    }
    TypedIdentifierNode.prototype.toString = function () {
        return this.id + " : " + this.t.toString();
    };
    TypedIdentifierNode.prototype.accept = function (v) {
        return v.visitTypedIdentifierNode(this);
    };
    return TypedIdentifierNode;
})(IdentifierNode);
exports.TypedIdentifierNode = TypedIdentifierNode;
var Type = (function (_super) {
    __extends(Type, _super);
    function Type(t) {
        _super.call(this);
        this.t = t;
    }
    Type.prototype.toString = function () {
        return this.t;
    };
    return Type;
})(Node);
exports.Type = Type;
var IntNode = (function (_super) {
    __extends(IntNode, _super);
    function IntNode(value) {
        _super.call(this);
        this.value = parseInt(value);
    }
    IntNode.prototype.toString = function () {
        return this.value;
    };
    IntNode.prototype.accept = function (v) {
        return v.visitIntNode(this);
    };
    return IntNode;
})(Node);
exports.IntNode = IntNode;
var DoubleNode = (function (_super) {
    __extends(DoubleNode, _super);
    function DoubleNode(value) {
        _super.call(this);
        this.value = parseFloat(value);
    }
    DoubleNode.prototype.toString = function () {
        return this.value;
    };
    DoubleNode.prototype.accept = function (v) {
        return v.visitDoubleNode(this);
    };
    return DoubleNode;
})(Node);
exports.DoubleNode = DoubleNode;
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
        this.el = el;
    }
    ArrayNode.prototype.toString = function () {
        return "{ " + this.el.toString() + " }";
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
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
    }
    BinaryExpressionNode.prototype.toString = function () {
        return this.lhs.toString() + " " + this.op + " " + this.rhs.toString();
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
        this.fid = fid;
        this.el = el;
    }
    FunctionCallNode.prototype.toString = function () {
        return this.fid.toString() + "( " + this.el.toString() + " )";
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
        this.a = a;
        this.i = i;
    }
    ArrayIndexNode.prototype.toString = function () {
        return this.a.toString() + "[ " + this.i.toString() + " ]";
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
        this.e = e;
        this.el = el;
    }
    ExpressionListNode.prototype.toString = function () {
        var s = this.e.toString();
        var el = this.el;
        while (el != null) {
            s = s + ", ";
            s = s + el.e.toString();
            el = el.el;
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
        this.e = e;
        this.ril = ril;
    }
    ReplicationExpressionNode.prototype.toString = function () {
        return this.e.toString() + this.ril.toString();
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
        this.i = i;
    }
    ReplicationGuideNode.prototype.toString = function () {
        return "<" + this.i.toString() + ">";
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
        this.ri = ri;
        this.ril = ril;
    }
    ReplicationGuideListNode.prototype.toString = function () {
        return this.ri.toString() + this.ril.toString();
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
var StatementListNode = (function (_super) {
    __extends(StatementListNode, _super);
    function StatementListNode(s, sl) {
        if (s === void 0) { s = null; }
        if (sl === void 0) { sl = null; }
        _super.call(this);
        this.s = s;
        this.sl = sl;
    }
    StatementListNode.prototype.toLines = function (indent) {
        var s = this.s.toLines(indent);
        var sl = this.sl;
        while (sl != null) {
            s = s.concat(sl.s.toLines(indent));
            sl = sl.sl;
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
        this.test = test;
        this.tsl = tsl;
        this.fsl = fsl;
    }
    IfStatementNode.prototype.toLines = function (indent) {
        return [indent + "if( " + this.test.toString() + " ){"]
            .concat(this.tsl.toLines(indent + "\t"))
            .concat([" } else { "])
            .concat(this.fsl.toLines(indent + "\t"));
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
        this.id = id;
        this.il = il;
        this.sl = sl;
    }
    FunctionDefinitionNode.prototype.toLines = function (indent) {
        return [indent + "def " + this.id.toString() + "( " + this.il.toString() + " ){"]
            .concat(this.sl.toLines("\t" + indent))
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
        this.id = id;
        this.e = e;
    }
    AssignmentNode.prototype.toLines = function (indent) {
        return [indent + this.id.toString() + " = " + this.e.toString() + ";"];
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
        this.e = e;
    }
    ReturnNode.prototype.toLines = function (indent) {
        return [indent + "return = " + this.e.toString() + ";"];
    };
    ReturnNode.prototype.accept = function (v) {
        return v.visitReturnNode(this);
    };
    return ReturnNode;
})(StatementNode);
exports.ReturnNode = ReturnNode;

},{}],2:[function(require,module,exports){
var Parser = require('./parser')
	, Interpreter = require('./interpreter').Interpreter
	, TypedFuncDef = require('./interpreter').TypedFuncDef
	, FuncArgExpr = require('./ast').FuncArgExpr;

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
    TypedFuncDef : TypedFuncDef,
    run : run
}

},{"./ast":1,"./interpreter":4,"./parser":5}],3:[function(require,module,exports){
//
// Environment
//
var Environment = (function () {
    function Environment(outer) {
        if (outer === void 0) { outer = null; }
        this.dict = {};
        this.outer = outer;
    }
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
    Interpreter.prototype.eval = function (sl) {
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
            s = sl.s;
            sl = sl.sl;
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
            s = sl.s;
            sl = sl.sl;
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
        var array = e.a.accept(this);
        var index = e.i.accept(this);
        return array[index];
    };
    Interpreter.prototype.visitArrayNode = function (e) {
        return e.el.accept(this);
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
        return this.env.lookup(e.id);
    };
    Interpreter.prototype.visitTypedIdentifierNode = function (e) {
        return this.env.lookup(e.id);
    };
    Interpreter.prototype.visitIdentifierListNode = function (n) {
        return null;
    };
    Interpreter.prototype.visitBinaryExpressionNode = function (e) {
        switch (e.op) {
            case "+":
                return e.lhs.accept(this) + e.rhs.accept(this);
            case "-":
                return e.lhs.accept(this) - e.rhs.accept(this);
            case "*":
                return e.lhs.accept(this) * e.rhs.accept(this);
            case "<":
                return e.lhs.accept(this) < e.rhs.accept(this);
            case "||":
                return e.lhs.accept(this) || e.rhs.accept(this);
            case "==":
                return e.lhs.accept(this) == e.rhs.accept(this);
            case ">":
                return e.lhs.accept(this) > e.rhs.accept(this);
        }
        throw new Error("Unknown binary operator type");
    };
    Interpreter.prototype.visitReturnNode = function (s) {
        return s.e.accept(this);
    };
    Interpreter.prototype.visitIfStatementNode = function (s) {
        var test = s.test.accept(this);
        if (test === true) {
            return this.evalBlockStatement(s.tsl);
        }
        else {
            return s.fsl.accept(this);
        }
    };
    Interpreter.prototype.evalBlockStatement = function (sl) {
        this.pushEnvironment();
        var r = sl.accept(this);
        this.popEnvironment();
        return r;
    };
    Interpreter.prototype.visitFunctionCallNode = function (e) {
        var fd = this.env.lookup(e.fid.id);
        return this.replicate(fd, e.el.accept(this));
    };
    Interpreter.prototype.visitReplicationExpressionNode = function (fa) {
        return new ReplicatedFunctionArgument(fa.e.accept(this), fa.ril);
    };
    Interpreter.prototype.visitExpressionListNode = function (el) {
        var vs = [];
        while (el != undefined) {
            vs.push(el.e.accept(this));
            el = el.el;
        }
        return vs;
    };
    Interpreter.prototype.visitAssignmentNode = function (s) {
        this.env.set(s.id.id, s.e.accept(this));
    };
    Interpreter.prototype.visitFunctionDefinitionNode = function (fds) {
        // unpack the argument list 
        var il = fds.il;
        var val = [];
        while (il != undefined) {
            val.push(il.id);
            il = il.il;
        }
        var fd;
        var env = this.env;
        var interpreter = this;
        function f() {
            var args = Array.prototype.slice.call(arguments);
            return interpreter.apply(fds, env, args);
        }
        fd = new TypedFunctionDefinition(f, val);
        this.env.set(fds.id.id, fd);
    };
    Interpreter.prototype.apply = function (fd, env, args) {
        env = new enviro.Environment(env);
        // bind the arguments in the scope 
        var i = 0;
        var il = fd.il;
        while (il != null) {
            env.set(il.id.id, args[i++]);
            il = il.il;
        }
        ;
        var current = this.env;
        this.env = env;
        var r = fd.sl.accept(this);
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

},{"./ast":1,"./environment":3}],5:[function(require,module,exports){
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
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,3],$V1=[1,11],$V2=[1,15],$V3=[1,10],$V4=[1,14],$V5=[1,16],$V6=[5,15],$V7=[5,14,15,16,19,25,28],$V8=[1,21],$V9=[2,20],$Va=[1,24],$Vb=[2,19],$Vc=[1,40],$Vd=[1,35],$Ve=[1,36],$Vf=[1,37],$Vg=[1,38],$Vh=[1,39],$Vi=[2,26],$Vj=[2,18],$Vk=[1,51],$Vl=[1,52],$Vm=[1,53],$Vn=[1,54],$Vo=[1,55],$Vp=[1,56],$Vq=[11,15,23,27,32,37,38,39,40,41,42],$Vr=[1,60],$Vs=[15,23],$Vt=[17,23,27],$Vu=[11,15,23,27,32,37,38,40,41,42],$Vv=[11,15,23,27,32,42];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Program":3,"StatementList":4,"ENDOFFILE":5,"Statement":6,"FunctionDefinition":7,"Block":8,"Assignment":9,"FunctionCall":10,"SEMICOLON":11,"IfStatement":12,"ReturnStatement":13,"LBRACE":14,"RBRACE":15,"RETURN":16,"ASSIGN":17,"Expression":18,"DEF":19,"Identifier":20,"LPAREN":21,"IdentifierList":22,"RPAREN":23,"TypedIdentifier":24,"IF":25,"ELSE":26,"COMMA":27,"ID":28,"COLON":29,"Type":30,"LBRACKET":31,"RBRACKET":32,"ExpressionList":33,"Literal":34,"BinaryExpression":35,"ReplicationGuideList":36,"PLUS":37,"MINUS":38,"TIMES":39,"EQUALITY":40,"RCARET":41,"OR":42,"ReplicationGuide":43,"LCARET":44,"INT":45,"TRUE":46,"FALSE":47,"STRING":48,"$accept":0,"$end":1},
terminals_: {2:"error",5:"ENDOFFILE",11:"SEMICOLON",14:"LBRACE",15:"RBRACE",16:"RETURN",17:"ASSIGN",19:"DEF",21:"LPAREN",23:"RPAREN",25:"IF",26:"ELSE",27:"COMMA",28:"ID",29:"COLON",31:"LBRACKET",32:"RBRACKET",37:"PLUS",38:"MINUS",39:"TIMES",40:"EQUALITY",41:"RCARET",42:"OR",44:"LCARET",45:"INT",46:"TRUE",47:"FALSE",48:"STRING"},
productions_: [0,[3,2],[4,2],[4,0],[6,1],[6,1],[6,1],[6,2],[6,1],[6,1],[8,3],[13,4],[7,8],[9,4],[12,5],[12,7],[22,3],[22,1],[22,0],[20,1],[24,1],[24,3],[30,1],[30,3],[33,3],[33,1],[33,0],[18,1],[18,1],[18,1],[18,1],[18,2],[18,3],[18,4],[35,3],[35,3],[35,3],[35,3],[35,3],[35,3],[43,3],[36,1],[36,2],[10,4],[34,1],[34,1],[34,1],[34,1],[34,3]],
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
case 10: case 32:
 this.$ = $$[$0-1]; 
break;
case 11:
 this.$ = record( new yy.ReturnNode( $$[$0-1] ), this._$); 
break;
case 12:
 this.$ = record( new yy.FunctionDefinitionNode( $$[$0-6], $$[$0-4], $$[$0-1]), this._$); 
break;
case 13:
 this.$ = record( new yy.AssignmentNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 14:
 this.$ = record( new yy.IfStatementNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 15:
 this.$ = record( new yy.IfStatementNode( $$[$0-4], $$[$0-2], $$[$0] ), this._$); 
break;
case 16:
 this.$ = record( new yy.IdentifierListNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 17:
 this.$ = record( new yy.IdentifierListNode( $$[$0] ), this._$); 
break;
case 19:
 this.$ = record( new yy.IdentifierNode($$[$0]), this._$); 
break;
case 21:
 this.$ = record( new yy.TypedIdentifierNode( $$[$0-2], $$[$0] ), this._$); 
break;
case 22:
 this.$ = record( new yy.Type( $$[$0] ), this._$); 
break;
case 23:
 this.$ = record( new yy.Type( $$[$0-2] ), this._$); 
break;
case 24:
 this.$ = record( new yy.ExpressionListNode($$[$0-2], $$[$0]), this._$); 
break;
case 25:
 this.$ = record( new yy.ExpressionListNode($$[$0]), this._$); 
break;
case 31:
 this.$ = record( new yy.ReplicationExpressionNode($$[$0-1], $$[$0]), this._$); 
break;
case 33:
 this.$ = record( new yy.ArrayIndexNode( $$[$0-3], $$[$0-1] ), this._$); 
break;
case 34: case 35:
 this.$ = record( new yy.BinaryExpressionNode($$[$0-1] ,$$[$0-2], $$[$0]), this._$); 
break;
case 36: case 37: case 38: case 39:
 this.$ = record( new yy.BinaryExpressionNode($$[$0-1], $$[$0-2], $$[$0]), this._$); 
break;
case 40:
 this.$ = record( new yy.ReplicationGuideNode( $$[$0-1] ), this._$); 
break;
case 41:
 this.$ = record( new yy.ReplicationGuideListNode( $$[$0] ), this._$); 
break;
case 42:
 this.$ = record( new yy.ReplicationGuideListNode( $$[$0-1], $$[$0] ), this._$); 
break;
case 43:
 this.$ = record( new yy.FunctionCallNode($$[$0-3], $$[$0-1]), this._$); 
break;
case 44:
 this.$ = record( new yy.IntNode( $$[$0] ), this._$); 
break;
case 45: case 46:
 this.$ = record( new yy.BooleanNode( $$[$0] ), this._$); 
break;
case 47:
 this.$ = record( new yy.StringNode( $$[$0] ), this._$); 
break;
case 48:
 this.$ = record( new yy.ArrayNode( $$[$0-1] ), this._$); 
break;
}
},
table: [{3:1,4:2,5:$V0,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:$V1,16:$V2,19:$V3,20:13,24:12,25:$V4,28:$V5},{1:[3]},{5:[1,17]},o($V6,$V0,{6:3,7:4,8:5,9:6,10:7,12:8,13:9,24:12,20:13,4:18,14:$V1,16:$V2,19:$V3,25:$V4,28:$V5}),o($V7,[2,4]),o($V7,[2,5]),o($V7,[2,6]),{11:[1,19]},o($V7,[2,8]),o($V7,[2,9]),{20:20,28:$V8},{4:22,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:$V1,15:$V0,16:$V2,19:$V3,20:13,24:12,25:$V4,28:$V5},{17:[1,23]},{17:$V9,21:$Va},{21:[1,25]},{17:[1,26]},o([17,21,23,27],$Vb,{29:[1,27]}),{1:[2,1]},o($V6,[2,2]),o($V7,[2,7]),{21:[1,28]},o([11,15,21,23,27,31,32,37,38,39,40,41,42,44],$Vb),{15:[1,29]},{10:33,14:$Vc,18:30,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:42,20:32,21:$Vd,23:$Vi,28:$V8,33:41,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:43,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:44,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{28:[1,46],30:45},{20:49,22:47,23:$Vj,24:48,28:$V5},o([5,14,15,16,19,25,26,28],[2,10]),{11:[1,50],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp},o($Vq,[2,27]),o($Vq,[2,28],{36:57,43:59,21:$Va,31:[1,58],44:$Vr}),o($Vq,[2,29]),o($Vq,[2,30]),{10:33,14:$Vc,18:61,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},o($Vq,[2,44]),o($Vq,[2,45]),o($Vq,[2,46]),o($Vq,[2,47]),{10:33,14:$Vc,15:$Vi,18:42,20:32,21:$Vd,28:$V8,33:62,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{23:[1,63]},o($Vs,[2,25],{27:[1,64],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp}),{23:[1,65],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp},{11:[1,66],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp},o($Vt,[2,21]),o($Vt,[2,22],{31:[1,67]}),{23:[1,68]},{23:[2,17],27:[1,69]},o([23,27],$V9),o($V7,[2,13]),{10:33,14:$Vc,18:70,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:71,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:72,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:73,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:74,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{10:33,14:$Vc,18:75,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},o($Vq,[2,31]),{10:33,14:$Vc,18:76,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},o($Vq,[2,41],{43:59,36:77,44:$Vr}),{10:33,14:$Vc,18:78,20:32,21:$Vd,28:$V8,34:31,35:34,45:$Ve,46:$Vf,47:$Vg,48:$Vh},{23:[1,79],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp},{15:[1,80]},o($Vq,[2,43]),o($Vs,$Vi,{34:31,20:32,10:33,35:34,18:42,33:81,14:$Vc,21:$Vd,28:$V8,45:$Ve,46:$Vf,47:$Vg,48:$Vh}),{8:82,14:$V1},o($V7,[2,11]),{32:[1,83]},{14:[1,84]},{20:49,22:85,23:$Vj,24:48,28:$V5},o($Vu,[2,34],{39:$Vm}),o($Vu,[2,35],{39:$Vm}),o($Vq,[2,36]),o($Vv,[2,37],{37:$Vk,38:$Vl,39:$Vm}),o($Vv,[2,38],{37:$Vk,38:$Vl,39:$Vm}),o($Vv,[2,39],{37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo}),{32:[1,86],37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:$Vo,42:$Vp},o($Vq,[2,42]),{37:$Vk,38:$Vl,39:$Vm,40:$Vn,41:[1,87],42:$Vp},o($Vq,[2,32]),o($Vq,[2,48]),o($Vs,[2,24]),o($V7,[2,14],{26:[1,88]}),o($Vt,[2,23]),{4:89,6:3,7:4,8:5,9:6,10:7,12:8,13:9,14:$V1,15:$V0,16:$V2,19:$V3,20:13,24:12,25:$V4,28:$V5},{23:[2,16]},o($Vq,[2,33]),o([11,15,23,27,32,37,38,39,40,41,42,44],[2,40],{34:31,20:32,10:33,35:34,18:74,14:$Vc,21:$Vd,28:$V8,45:$Ve,46:$Vf,47:$Vg,48:$Vh}),{6:90,7:4,8:5,9:6,10:7,12:8,13:9,14:$V1,16:$V2,19:$V3,20:13,24:12,25:$V4,28:$V5},{15:[1,91]},o($V7,[2,15]),o($V7,[2,12])],
defaultActions: {17:[2,1],85:[2,16]},
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
case 1:return 25;
break;
case 2:return 26;
break;
case 3:return 19;
break;
case 4:return 'VAR';
break;
case 5:return 'NUL';
break;
case 6:return 46;
break;
case 7:return 47;
break;
case 8:return 16;
break;
case 9:return 45;
break;
case 10:return 28;
break;
case 11:return 48;
break;
case 12:return 40;
break;
case 13:return 17;
break;
case 14:return 37;
break;
case 15:return 38;
break;
case 16:return 39;
break;
case 17:return 29;
break;
case 18:return 27;
break;
case 19:return 44;
break;
case 20:return 41;
break;
case 21:return 42;
break;
case 22:return 'NOT';
break;
case 23:return 'DOT';
break;
case 24:return 14;
break;
case 25:return 15;
break;
case 26:return 21;
break;
case 27:return 23;
break;
case 28:return 31;
break;
case 29:return 32;
break;
case 30:return 11;
break;
case 31:/* skip whitespace */
break;
case 32:throw 'Illegal character';
break;
case 33:return 5;
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:def\b)/,/^(?:var\b)/,/^(?:null\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:return\b)/,/^(?:([0-9])+)/,/^(?:([a-zA-Z][a-zA-Z0-9]*))/,/^(?:"([a-zA-Z0-9\s]*)")/,/^(?:==)/,/^(?:=)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?::)/,/^(?:,)/,/^(?:<)/,/^(?:>)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\.)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:;)/,/^(?:\s+)/,/^(?:\.)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33],"inclusive":true}}
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
},{"_process":8,"fs":6,"path":7}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
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
},{"_process":8}],8:[function(require,module,exports){
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