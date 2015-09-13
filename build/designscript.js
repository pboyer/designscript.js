(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.designscript = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Parser = require('../src/Parser')
	, Interpreter = require('../src/interpreter/AssociativeInterpreter').AssociativeInterpreter
	, TypedFunction = require('../src/interpreter/RuntimeTypes').TypedFunction
	, TypedArgument = require('../src/interpreter/RuntimeTypes').TypedArgument
	, ast = require('../src/AST');
	
Parser.parser.yy = ast;

function run(p){
	var pp = Parser.parse( p );
	(new Interpreter()).run( pp );
}

module.exports = 
{
    AST : ast,
    Parser : Parser.parser,
    Interpreter : Interpreter,
    TypedFunction : TypedFunction,
    TypedArgument : TypedArgument,
    run : run
};
},{"../src/AST":2,"../src/Parser":3,"../src/interpreter/AssociativeInterpreter":4,"../src/interpreter/RuntimeTypes":9}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ParserState = (function () {
    function ParserState() {
    }
    return ParserState;
})();
exports.ParserState = ParserState;
// not exported! this allows internal code sharing 
// between nodes
var ParsedNode = (function () {
    function ParsedNode() {
    }
    return ParsedNode;
})();
//
// Identifiers
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
    IdentifierListNode.prototype.cpsAccept = function (v, c) {
        v.visitIdentifierListNode(this, c);
    };
    return IdentifierListNode;
})(ParsedNode);
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
    IdentifierNode.prototype.cpsAccept = function (v, c) {
        v.visitIdentifierNode(this, c);
    };
    return IdentifierNode;
})(ParsedNode);
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
    Type.prototype.accept = function (v) {
        throw new Error("Not implemented!");
    };
    Type.prototype.cpsAccept = function (v, c) {
        throw new Error("Not implemented!");
    };
    return Type;
})(ParsedNode);
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
    NumberNode.prototype.cpsAccept = function (v, ret) {
        return v.visitNumberNode(this, ret);
    };
    return NumberNode;
})(ParsedNode);
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
    BooleanNode.prototype.cpsAccept = function (v, c) {
        v.visitBooleanNode(this, c);
    };
    return BooleanNode;
})(ParsedNode);
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
    StringNode.prototype.cpsAccept = function (v, c) {
        v.visitStringNode(this, c);
    };
    return StringNode;
})(ParsedNode);
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
    ArrayNode.prototype.cpsAccept = function (v, c) {
        v.visitArrayNode(this, c);
    };
    return ArrayNode;
})(ParsedNode);
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
    BinaryExpressionNode.prototype.cpsAccept = function (v, ret) {
        return v.visitBinaryExpressionNode(this, ret);
    };
    return BinaryExpressionNode;
})(ParsedNode);
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
    RangeExpressionNode.prototype.cpsAccept = function (v, c) {
        v.visitRangeExpressionNode(this, c);
    };
    return RangeExpressionNode;
})(ParsedNode);
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
    FunctionCallNode.prototype.cpsAccept = function (v, c) {
        v.visitFunctionCallNode(this, c);
    };
    return FunctionCallNode;
})(ParsedNode);
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
    ArrayIndexNode.prototype.cpsAccept = function (v, c) {
        v.visitArrayIndexNode(this, c);
    };
    return ArrayIndexNode;
})(ParsedNode);
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
    ExpressionListNode.prototype.cpsAccept = function (v, c) {
        v.visitExpressionListNode(this, c);
    };
    return ExpressionListNode;
})(ParsedNode);
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
    ReplicationExpressionNode.prototype.cpsAccept = function (v, c) {
        v.visitReplicationExpressionNode(this, c);
    };
    return ReplicationExpressionNode;
})(ParsedNode);
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
    ReplicationGuideNode.prototype.cpsAccept = function (v, c) {
        v.visitReplicationGuideNode(this, c);
    };
    return ReplicationGuideNode;
})(ParsedNode);
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
    ReplicationGuideListNode.prototype.cpsAccept = function (v, c) {
        v.visitReplicationGuideListNode(this, c);
    };
    return ReplicationGuideListNode;
})(ParsedNode);
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
    StatementNode.prototype.accept = function (v) {
        throw new Error("Not implemented!");
    };
    StatementNode.prototype.cpsAccept = function (v, c) {
        throw new Error("Not implemented!");
    };
    return StatementNode;
})(ParsedNode);
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
    AssociativeBlockNode.prototype.cpsAccept = function (v, c) {
        v.visitAssociativeBlockNode(this, c);
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
    ImperativeBlockNode.prototype.cpsAccept = function (v, c) {
        v.visitImperativeBlockNode(this, c);
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
    StatementListNode.prototype.cpsAccept = function (v, ret) {
        return v.visitStatementListNode(this, ret);
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
    IfStatementNode.prototype.cpsAccept = function (v, c) {
        v.visitIfStatementNode(this, c);
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
    FunctionDefinitionNode.prototype.cpsAccept = function (v, c) {
        v.visitFunctionDefinitionNode(this, c);
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
    AssignmentNode.prototype.cpsAccept = function (v, ret) {
        return v.visitAssignmentNode(this, ret);
    };
    return AssignmentNode;
})(StatementNode);
exports.AssignmentNode = AssignmentNode;

},{}],3:[function(require,module,exports){
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
case 11:
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
case 15:
 this.$ = recordState( new yy.AssignmentNode( new yy.IdentifierNode( $$[$0-3] ), $$[$0-1] ), this._$); 
break;
case 16:
 this.$ = recordState( new yy.AssignmentNode( new yy.IdentifierNode( $$[$0-2] ), $$[$0] ), this._$); 
break;
case 17:
 this.$ = recordState( new yy.FunctionDefinitionNode( $$[$0-6], $$[$0-4], $$[$0-1]), this._$); 
break;
case 18:
 this.$ = recordState( new yy.AssignmentNode( $$[$0-3], $$[$0-1] ), this._$); 
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
case 30:
 this.$ = recordState( new yy.ExpressionListNode(), this._$); 
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
},{"_process":12,"fs":10,"path":11}],4:[function(require,module,exports){
var AST = require('../AST');
var Environment_1 = require('./Environment');
var RuntimeTypes_1 = require('./RuntimeTypes');
var Replicator_1 = require('./Replicator');
var Range_1 = require('./Range');
var ImperativeInterpreter_1 = require('./ImperativeInterpreter');
var DependencyNode = (function () {
    // Make a DependencyNode from a function that is in continuation passing style
    // e.g. function(arg1, ... , argn, callback )
    function DependencyNode(f) {
        this.id = DependencyNode.gid++;
        this.dirty = true;
        this.inputs = [];
        this.outputs = [];
        this.value = null;
        this.f = f;
    }
    DependencyNode.constant = function (val) {
        // the constant node function is passed a single argument, the callback
        // it simply invokes that function with the constant as the argument
        var n = new DependencyNode(function (c) { return c(val); });
        n.dirty = false;
        n.value = val;
        return n;
    };
    // Make a DependencyNode from a function that is not in continuation passing style
    DependencyNode.byFunction = function (f) {
        return new DependencyNode(function () {
            // we obtain the arguments
            var args = Array.prototype.slice.call(arguments);
            // get the callback
            var c = args.pop();
            // call the synchronous function
            c(f.apply(undefined, args));
        });
    };
    // evaluate the function, storing it in the value field
    DependencyNode.prototype.eval = function (ret) {
        var _this = this;
        // obtain the cached value of the dependencies
        // they should have already been evaluated
        var args = this.inputs.map(function (x) { return x.value; });
        // we add on the ret function as the final argument
        args.push(function (v) {
            _this.value = v;
            _this.dirty = false;
            ret(_this);
        });
        // invoke the funcuton
        this.f.apply(undefined, args);
    };
    DependencyNode.gid = 0;
    return DependencyNode;
})();
exports.DependencyNode = DependencyNode;
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
var AssociativeInterpreter = (function () {
    function AssociativeInterpreter(debug) {
        this.env = new Environment_1.Environment();
        // default continuation
        this.debug = function (a, e, s, ret) {
            // by default
            ret();
        };
        if (debug) {
            this.debug = debug;
        }
        this.addBuiltins();
    }
    AssociativeInterpreter.prototype.run = function (node, ret) {
        var _this = this;
        if (!ret)
            ret = function () { };
        this.evalFunctionDefinitionNodes(node, function () {
            _this.visitStatementListNode(node, ret);
        });
    };
    AssociativeInterpreter.prototype.addBuiltins = function () {
        this.env.set('print', RuntimeTypes_1.TypedFunction.byFunction(function (x) { return console.log(x); }, [new RuntimeTypes_1.TypedArgument('a', 'var')], 'print'));
        this.addBinop('+', function (a, b) { return a + b; });
        this.addBinop('*', function (a, b) { return a * b; });
        this.addBinop('/', function (a, b) { return a / b; });
        this.addBinop('-', function (a, b) { return a - b; });
    };
    AssociativeInterpreter.prototype.addBinop = function (op, func) {
        this.env.set(op, RuntimeTypes_1.TypedFunction.byFunction(func, [new RuntimeTypes_1.TypedArgument('a', 'var'),
            new RuntimeTypes_1.TypedArgument('b', 'var')], op));
    };
    // passes control to someone else
    AssociativeInterpreter.prototype.step = function (node, ret) {
        if (this.debug) {
            this.debug(node, this.env, [], ret);
        }
        else {
            ret();
        }
    };
    AssociativeInterpreter.prototype.evalFunctionDefinitionNodes = function (node, ret) {
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
    AssociativeInterpreter.prototype.visitStatementListNode = function (node, ret) {
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
    AssociativeInterpreter.prototype.visitIdentifierNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            ret(_this.env.lookup(node.name));
        });
    };
    AssociativeInterpreter.prototype.literal = function (node, ret) {
        this.step(node, function () { return ret(DependencyNode.constant(node.value)); });
    };
    AssociativeInterpreter.prototype.visitBooleanNode = function (node, ret) {
        this.literal(node, ret);
    };
    AssociativeInterpreter.prototype.visitStringNode = function (node, ret) {
        this.literal(node, ret);
    };
    AssociativeInterpreter.prototype.visitNumberNode = function (node, ret) {
        this.literal(node, ret);
    };
    AssociativeInterpreter.prototype.visitBinaryExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // evaluate first expression
            node.firstExpression.cpsAccept(_this, function (a) {
                // evaluate second
                node.secondExpression.cpsAccept(_this, function (b) {
                    var n;
                    // evaluate
                    switch (node.operator) {
                        case '*':
                        case '+':
                        case '-':
                        case '/':
                            var f = _this.env.lookup(node.operator);
                            n = new DependencyNode(function (a, b, c) {
                                return Replicator_1.Replicator.cpsreplicate(f, [a, b], c);
                            });
                            break;
                        case '<':
                            n = DependencyNode.byFunction(function (a, b) { return a < b; });
                            break;
                        case '||':
                            n = DependencyNode.byFunction(function (a, b) { return a || b; });
                            break;
                        case '==':
                            n = DependencyNode.byFunction(function (a, b) { return a == b; });
                            break;
                        case '>':
                            n = DependencyNode.byFunction(function (a, b) { return a > b; });
                            break;
                        default:
                            throw _this.error('Unknown binary operator type', node.parserState);
                    }
                    connect(a, n, 0);
                    connect(b, n, 1);
                    n.eval(ret);
                });
            });
        });
    };
    AssociativeInterpreter.prototype.visitAssignmentNode = function (node, ret) {
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
    AssociativeInterpreter.prototype.visitFunctionCallNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            _this.visitExpressionListNode(node.arguments, function (args) {
                var f = _this.env.lookup(node.functionId.name);
                // by putting the instanceof operator in the test expr the 
                // typescript compiler checks types in the conditional body
                if (f instanceof RuntimeTypes_1.TypedFunction) {
                    var n = new DependencyNode(function () {
                        // the arguments include the callback...
                        var fargs = Array.prototype.slice.call(arguments);
                        // so we extract the callback...
                        var cb = fargs.pop();
                        // and replicate
                        Replicator_1.Replicator.cpsreplicate(f, fargs, cb);
                    });
                    // connect all of the upstream nodes
                    args.forEach(function (x, i) { return connect(x, n, i); });
                    // we eagerly evaluate the node passing it ret
                    n.eval(ret);
                    return;
                }
                throw _this.error(node.functionId.name + ' is not a function.', node.parserState);
            });
        });
    };
    AssociativeInterpreter.prototype.visitFunctionDefinitionNode = function (fds, ret) {
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
            // obtain the arguments object as an array
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
    AssociativeInterpreter.prototype.apply = function (fd, env, args, ret) {
        var _this = this;
        env = new Environment_1.Environment(env);
        // bind
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            // set the value without calling the function
            env.set(il.head.name, DependencyNode.constant(args[i++]));
            il = il.tail;
        }
        ;
        var current = this.env;
        this.env = env;
        // evaluate the body
        fd.body.cpsAccept(this, function (x) {
            // return to the original environment
            _this.env = current;
            ret(x.value);
        });
    };
    AssociativeInterpreter.prototype.visitArrayIndexNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // get the array node
            node.array.cpsAccept(_this, function (an) {
                // get the index node
                node.index.cpsAccept(_this, function (ai) {
                    // build the node extracting the array index
                    var n = new DependencyNode(function (a, i, c) { return c(a[i]); });
                    // connect the nodes
                    connect(an, n, 0);
                    connect(ai, n, 1);
                    // evaluate
                    n.eval(ret);
                });
            });
        });
    };
    AssociativeInterpreter.prototype.visitArrayNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.expressionList.cpsAccept(_this, function (els) {
                var n = DependencyNode.byFunction(function () {
                    return Array.prototype.slice.call(arguments);
                });
                els.forEach(function (x, i) { return connect(x, n, i); });
                n.eval(ret);
            });
        });
    };
    AssociativeInterpreter.prototype.visitExpressionListNode = function (node, ret) {
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
    AssociativeInterpreter.prototype.visitIfStatementNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.testExpression.cpsAccept(_this, function (test) {
                test.value ?
                    node.trueStatementList.cpsAccept(_this, ret)
                    : node.falseStatementList.cpsAccept(_this, ret);
            });
        });
    };
    AssociativeInterpreter.prototype.visitRangeExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.start.cpsAccept(_this, function (start) {
                if (typeof start.value != 'number')
                    throw _this.error('start must be a number.', node.parserState);
                node.end.cpsAccept(_this, function (end) {
                    if (typeof end.value != 'number')
                        throw _this.error('end must be a number.', node.parserState);
                    if (!node.step) {
                        var n = DependencyNode.byFunction(Range_1.Range.byStartEnd);
                        connect(start, n, 0);
                        connect(end, n, 1);
                        n.eval(ret);
                        return;
                    }
                    node.step.cpsAccept(_this, function (step) {
                        if (typeof step.value != 'number')
                            throw _this.error('step must be a number.', node.parserState);
                        var f = node.isStepCount ?
                            Range_1.Range.byStepCount :
                            Range_1.Range.byStepSize;
                        var n = DependencyNode.byFunction(f);
                        connect(start, n, 0);
                        connect(end, n, 1);
                        connect(step, n, 2);
                        n.eval(ret);
                    });
                });
            });
        });
    };
    AssociativeInterpreter.prototype.visitReplicationGuideNode = function (node, ret) {
        var _this = this;
        this.step(node, function () { return node.index.cpsAccept(_this, ret); });
    };
    AssociativeInterpreter.prototype.visitReplicationExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.expression.cpsAccept(_this, function (e) {
                node.replicationGuideList.cpsAccept(_this, function (rl) {
                    var n = DependencyNode.byFunction(function (e, rl) { return new RuntimeTypes_1.ReplicatedExpression(e, rl); });
                    connect(e, n, 0);
                    connect(e, n, 1);
                    n.eval(ret);
                });
            });
        });
    };
    AssociativeInterpreter.prototype.visitReplicationGuideListNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // simply collect the arguments and return as an array
            var n = DependencyNode.byFunction(function () { return Array.prototype.slice.call(arguments); });
            // connect all of the inputs
            var i = 0;
            var iterate = function (n) {
                if (!n || !n.head) {
                    n.eval(ret);
                }
                else {
                    n.head.cpsAccept(_this, function (x) {
                        connect(x, n, i++);
                        iterate(n.tail);
                    });
                }
            };
            iterate(node);
        });
    };
    AssociativeInterpreter.prototype.visitAssociativeBlockNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // build a dependency node that when evaluated...
            var n = new DependencyNode(function (c) {
                // runs the associative block
                node.statementList.cpsAccept(
                // in a new interpreter
                new AssociativeInterpreter(this.debug), 
                // and extracts the resultant value from the evaluated DependencyNode
                // and extracts the resultant value from the evaluated DependencyNode
                function (n) { return c(n.value); });
            }.bind(_this));
            // go...
            n.eval(ret);
        });
    };
    AssociativeInterpreter.prototype.visitImperativeBlockNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            // build a dependency node that when evaluated...
            var n = new DependencyNode(function (c) {
                // runs the imperative block
                node.statementList.cpsAccept(
                // in a new interpreter
                new ImperativeInterpreter_1.ImperativeInterpreter(this.debug), 
                // and turns the resultant value into a constant
                c);
            }.bind(_this));
            // go...
            n.eval(ret);
        });
    };
    AssociativeInterpreter.prototype.visitIdentifierListNode = function (node, ret) { throw new Error("Not implemented"); };
    AssociativeInterpreter.prototype.error = function (message, state) {
        return new RuntimeTypes_1.DesignScriptError(message, state);
    };
    return AssociativeInterpreter;
})();
exports.AssociativeInterpreter = AssociativeInterpreter;

},{"../AST":2,"./Environment":5,"./ImperativeInterpreter":6,"./Range":7,"./Replicator":8,"./RuntimeTypes":9}],5:[function(require,module,exports){
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
            return this.outer.contains(id);
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

},{}],6:[function(require,module,exports){
var AST = require('../AST');
var Environment_1 = require('./Environment');
var RuntimeTypes_1 = require('./RuntimeTypes');
var Replicator_1 = require('./Replicator');
var Range_1 = require('./Range');
var AssociativeInterpreter_1 = require('./AssociativeInterpreter');
var ImperativeInterpreter = (function () {
    function ImperativeInterpreter(debug) {
        this.env = new Environment_1.Environment();
        // default continuation
        this.debug = function (a, e, s, ret) {
            // by default
            ret();
        };
        if (debug) {
            this.debug = debug;
        }
        this.addBuiltins();
    }
    ImperativeInterpreter.prototype.run = function (node, ret) {
        var _this = this;
        if (!ret)
            ret = function () { };
        this.evalFunctionDefinitionNodes(node, function () {
            _this.visitStatementListNode(node, ret);
        });
    };
    ImperativeInterpreter.prototype.addBuiltins = function () {
        this.env.set('print', new RuntimeTypes_1.TypedFunction(function (x) { return console.log(x); }, [new RuntimeTypes_1.TypedArgument('a', 'var')], 'print'));
        this.addBinop('+', function (a, b) { return a + b; });
        this.addBinop('*', function (a, b) { return a * b; });
        this.addBinop('/', function (a, b) { return a / b; });
        this.addBinop('-', function (a, b) { return a - b; });
    };
    ImperativeInterpreter.prototype.addBinop = function (op, func) {
        this.env.set(op, RuntimeTypes_1.TypedFunction.byFunction(func, [new RuntimeTypes_1.TypedArgument('a', 'var'),
            new RuntimeTypes_1.TypedArgument('b', 'var')], op));
    };
    // passes control to someone else
    ImperativeInterpreter.prototype.step = function (node, ret) {
        if (this.debug) {
            this.debug(node, this.env, [], ret);
        }
        else {
            ret();
        }
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
                        case '*':
                        case '+':
                        case '-':
                        case '/':
                            return Replicator_1.Replicator.cpsreplicate(_this.env.lookup(node.operator), [a, b], ret);
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
                Replicator_1.Replicator.cpsreplicate(f, args, ret);
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
    ImperativeInterpreter.prototype.visitReplicationExpressionNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.expression.cpsAccept(_this, function (e) {
                node.replicationGuideList.cpsAccept(_this, function (rl) {
                    ret(new RuntimeTypes_1.ReplicatedExpression(e, rl));
                });
            });
        });
    };
    ImperativeInterpreter.prototype.visitReplicationGuideNode = function (node, ret) {
        var _this = this;
        this.step(node, function () { return node.index.cpsAccept(_this, ret); });
    };
    ImperativeInterpreter.prototype.visitReplicationGuideListNode = function (node, ret) {
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
    ImperativeInterpreter.prototype.visitImperativeBlockNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.statementList.cpsAccept(new ImperativeInterpreter(_this.debug), ret);
        });
    };
    ImperativeInterpreter.prototype.visitAssociativeBlockNode = function (node, ret) {
        var _this = this;
        this.step(node, function () {
            node.statementList.cpsAccept(new AssociativeInterpreter_1.AssociativeInterpreter(_this.debug), function (n) { return ret(n.value); });
        });
    };
    ImperativeInterpreter.prototype.visitIdentifierListNode = function (node, ret) { throw new Error("Not implemented"); };
    ImperativeInterpreter.prototype.error = function (message, state) {
        return new RuntimeTypes_1.DesignScriptError(message, state);
    };
    return ImperativeInterpreter;
})();
exports.ImperativeInterpreter = ImperativeInterpreter;

},{"../AST":2,"./AssociativeInterpreter":4,"./Environment":5,"./Range":7,"./Replicator":8,"./RuntimeTypes":9}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var RuntimeTypes_1 = require("./RuntimeTypes");
var Replicator = (function () {
    function Replicator() {
    }
    Replicator.cpsreplicate = function (fd, args, ret, repGuides) {
        if (!repGuides) {
            repGuides = new Array(args.length);
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof RuntimeTypes_1.ReplicatedExpression) {
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
            args.push(ret);
            return fd.func.apply(undefined, args);
        }
        var sortedRepGuides = repGuides ? Replicator.sortRepGroups(repGuides, args.length) : [Replicator.range(args.length)];
        Replicator.cpsreplicateCore(fd, args, expectedTypes, sortedRepGuides, 0, ret);
    };
    Replicator.cpsreplicateCore = function (fd, args, expectedTypes, sortedRepGuides, curRepGuide, ret) {
        var isTypeMatch = Replicator.allTypesMatch(args, expectedTypes);
        // are we at the the last replication guide and matching
        if (curRepGuide > sortedRepGuides.length - 1) {
            if (isTypeMatch) {
                args.push(ret);
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure: " + "Expected " + expectedTypes + ", but got " + args);
        }
        var s = sortedRepGuides[curRepGuide];
        var minLen = s.reduce(function (a, x) { return (args[x] instanceof Array) ?
            Math.min(args[x].length, a) : a; }, Number.MAX_VALUE);
        var iter = function (i, r) {
            if (i >= minLen) {
                return ret(r);
            }
            // build up all args to be replicated
            var curargs = [];
            for (var j = 0, l = args.length; j < l; j++) {
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
            Replicator.cpsreplicateCore(fd, curargs, expectedTypes, sortedRepGuides, curRepGuide + 1, function (v) {
                r.push(v);
                iter(i + 1, r);
            });
        };
        iter(0, []);
    };
    Replicator.replicate = function (fd, args, repGuides) {
        if (!repGuides) {
            repGuides = new Array(args.length);
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof RuntimeTypes_1.ReplicatedExpression) {
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

},{"./RuntimeTypes":9}],9:[function(require,module,exports){
var TypedFunction = (function () {
    function TypedFunction(f, al, name) {
        this.func = f;
        this.argumentTypes = al;
        this.name = name;
    }
    TypedFunction.byFunction = function (f, al, name) {
        return new TypedFunction(function () {
            // we obtain the arguments
            var args = Array.prototype.slice.call(arguments);
            // get the callback
            var c = args.pop();
            // call the synchronous function
            c(f.apply(undefined, args));
        }, al, name);
    };
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
var DesignScriptError = (function () {
    function DesignScriptError(message, state) {
        this.message = message;
        this.state = state;
    }
    DesignScriptError.prototype.toString = function () {
        return "Error: " + this.message;
    };
    return DesignScriptError;
})();
exports.DesignScriptError = DesignScriptError;

},{}],10:[function(require,module,exports){

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

},{}]},{},[1])(1)
});