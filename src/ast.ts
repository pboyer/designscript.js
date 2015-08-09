import visitor = require('./visitor');

export class Node {
    parserState : ParserState;
}

export class ParserState {
    firstLine: number;
    lastLine: number;
    firstCol: number;
    lastCol: number;
}


//
// IdentifierNode
//

export class IdentifierListNode extends Node {
    head: IdentifierNode;
    tail: IdentifierListNode;

    constructor(id: IdentifierNode, il: IdentifierListNode) {
        super();
        this.head = id;
        this.tail = il;
    }

    toString() {
        return this.tail == null ?
            this.head.toString() :
            this.head.toString() + ", " + this.tail.toString();
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitIdentifierListNode(this);
    }
}

export class IdentifierNode extends Node {
    type: Type;
    name: string;

    constructor(id: string, t: Type = null) {
        super();
        this.name = id;
        this.type = t;
    }

    toString() {
        return this.type ? this.name + " : " + this.type.toString() : this.name;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitIdentifierNode(this);
    }
}

export class Type extends Node {
    name: string;

    constructor(t: string) {
        super();
        this.name = t;
    }

    toString() {
        return this.name;
    }
}

//
// Expressions 
//

interface ExpressionNode {
    accept<T>(v: visitor.Visitor<T>): T;
}

export class NumberNode extends Node implements ExpressionNode {
    value: Number;

    constructor(value: string) {
        super();
        this.value = parseFloat(value);
    }

    toString() {
        return this.value;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitNumberNode(this);
    }
}

export class BooleanNode extends Node implements ExpressionNode {
    value: boolean;

    constructor(value: string) {
        super();
        this.value = value === "true";
    }

    toString() {
        return this.value;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitBooleanNode(this);
    }
}

export class StringNode extends Node implements ExpressionNode {
    value: string;

    constructor(value: string) {
        super();
        this.value = value.slice(1, value.length - 1);
    }

    toString() {
        return this.value;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitStringNode(this);
    }
}

export class ArrayNode extends Node implements ExpressionNode {
    expressionList: ExpressionListNode;

    constructor(el: ExpressionListNode) {
        super();
        this.expressionList = el;
    }

    toString() {
        return "{ " + this.expressionList.toString() + " }";
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitArrayNode(this);
    }
}

export class BinaryExpressionNode extends Node implements ExpressionNode {
    operator: string;
    firstExpression: ExpressionNode;
    secondExpression: ExpressionNode;

    constructor(op: string, lhs: ExpressionNode, rhs: ExpressionNode) {
        super();
        this.operator = op;
        this.firstExpression = lhs;
        this.secondExpression = rhs;
    }

    toString() {
        return this.firstExpression.toString() + " " + this.operator + " " + this.secondExpression.toString();
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitBinaryExpressionNode(this);
    }
}

export class RangeExpressionNode extends Node implements ExpressionNode {
    start: ExpressionNode;
    end: ExpressionNode;
    step: ExpressionNode;
    isStepCount: boolean;

    constructor(start : ExpressionNode, end : ExpressionNode, step : ExpressionNode = null, isStepCount = false) {
        super();
        this.start = start;
        if (end instanceof RangeExpressionNode) 
            throw new Error("Multiply nested range expressions are not supported");
        this.end = end;
        if (step instanceof RangeExpressionNode) 
            throw new Error("step cannot be a RangeExpression");
        this.step = step;
        this.isStepCount = isStepCount;
    }

    toString() {
        return 
            this.start.toString() + ".." + this.end.toString() + 
                (this.step == null ? "" : 
                    ".." + (this.isStepCount ? "#" : "") + this.step.toString());
            
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitRangeExpressionNode(this);
    }
}

export class FunctionCallNode extends Node implements ExpressionNode {
    functionId: IdentifierNode;
    arguments: ExpressionListNode;

    constructor(fid: IdentifierNode, el: ExpressionListNode) {
        super();
        this.functionId = fid;
        this.arguments = el;
    }

    toString() {
        return this.functionId.toString() + "( " + this.arguments.toString() + " )";
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitFunctionCallNode(this);
    }
}

export class ArrayIndexNode extends Node implements ExpressionNode {
    array: ExpressionNode;
    index: ExpressionNode;

    constructor(a: ExpressionNode, i: ExpressionNode) {
        super();
        this.array = a;
        this.index = i;
    }

    toString() {
        return this.array.toString() + "[ " + this.index.toString() + " ]";
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitArrayIndexNode(this);
    }
}

export class ExpressionListNode extends Node {
    head: ExpressionNode;
    tail: ExpressionListNode;

    constructor(e: ExpressionNode, el: ExpressionListNode) {
        super();
        this.head = e;
        this.tail = el;
    }

    toString() {
        var s = this.head.toString();
        var el = this.tail;
        while (el != null) {
            s = s + ", ";
            s = s + el.head.toString();
            el = el.tail;
        }
        return s;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitExpressionListNode(this);
    }
}

export class ReplicationExpressionNode extends Node implements ExpressionNode {
    expression: ExpressionNode;
    replicationGuideList: ReplicationGuideListNode;

    constructor(e: IdentifierNode, ril: ReplicationGuideListNode) {
        super();
        this.expression = e;
        this.replicationGuideList = ril;
    }

    toString() {
        return this.expression.toString() + this.replicationGuideList.toString();
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitReplicationExpressionNode(this);
    }
}

export class ReplicationGuideNode extends Node implements ExpressionNode {
    index: ExpressionNode;

    constructor(i: ExpressionNode) {
        super();
        this.index = i;
    }

    toString() {
        return "<" + this.index.toString() + ">";
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitReplicationGuideNode(this);
    }
}

export class ReplicationGuideListNode extends Node implements ExpressionNode {
    head: ReplicationGuideNode;
    tail: ReplicationGuideListNode;

    constructor(ri: ReplicationGuideNode, ril: ReplicationGuideListNode = null) {
        super();
        this.head = ri;
        this.tail = ril;
    }

    toString() {
        return this.head.toString() + this.tail.toString();
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitReplicationGuideListNode(this);
    }
}

//
// Statements
//

export class StatementNode extends Node {
    toString() {
        return this.toLines("").join("\n");
    }

    toLines(indent: string): string[] {
        return [];
    }
}

export class LanguageBlockNode extends StatementNode {
    name: string;
    statementList: StatementListNode;

    constructor(name: string, sl: StatementListNode) {
        super();
        this.name = name;
        this.statementList = sl;
    }

    toLines(indent: string): string[] {
        return [indent + "[" + this.name + "]{"]
            .concat(this.statementList.toLines(indent + "\t"))
            .concat([indent + "}"]);
    }
}

export class AssociativeBlockNode extends LanguageBlockNode {
    constructor(sl: StatementListNode) {
        super("Associative", sl);
    }
    
    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitAssociativeBlockNode(this);
    }
}

export class ImperativeBlockNode extends LanguageBlockNode {
    constructor(sl: StatementListNode) {
        super("Imperative", sl);
    }
    
    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitImperativeBlockNode(this);
    }
}

export class StatementListNode extends StatementNode {
    head: StatementNode;
    tail: StatementListNode;

    constructor(s: StatementNode = null, sl: StatementListNode = null) {
        super();
        this.head = s;
        this.tail = sl;
    }

    toLines(indent: string) {
        var s = this.head.toLines(indent);
        var sl = this.tail;
        while (sl != null) {
            s = s.concat(sl.head.toLines(indent));
            sl = sl.tail;
        }
        return s;
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitStatementListNode(this);
    }
}

export class IfStatementNode extends StatementNode {
    testExpression: ExpressionNode;
    trueStatementList: StatementListNode;
    falseStatementList: StatementListNode;

    constructor(test: ExpressionNode, tsl: StatementListNode, fsl: StatementListNode) {
        super();
        this.testExpression = test;
        this.trueStatementList = tsl;
        this.falseStatementList = fsl;
    }

    toLines(indent: string) {
        return [indent + "if( " + this.testExpression.toString() + " ){"]
            .concat(this.trueStatementList.toLines(indent + "\t"))
            .concat([indent + " } else { "])
            .concat(this.falseStatementList.toLines(indent + "\t"));
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitIfStatementNode(this);
    }
}

export class FunctionDefinitionNode extends StatementNode {
    identifier: IdentifierNode;
    arguments: IdentifierListNode;
    body: StatementListNode;

    constructor(id: IdentifierNode, il: IdentifierListNode, sl: StatementListNode) {
        super();
        this.identifier = id;
        this.arguments = il;
        this.body = sl;
    }

    toLines(indent: string) {
        return [indent + "def " + this.identifier.toString() + "( " + this.arguments.toString() + " ){"]
            .concat(this.body.toLines("\t" + indent))
            .concat([indent + "}"]);
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitFunctionDefinitionNode(this);
    }
}

export class AssignmentNode extends StatementNode {
    identifier: IdentifierNode;
    expression: ExpressionNode;

    constructor(id: IdentifierNode, e: ExpressionNode) {
        super();
        this.identifier = id;
        this.expression = e;
    }

    toLines(indent) {
        return [indent + this.identifier.toString() + " = " + this.expression.toString() + ";"];
    }

    accept<T>(v: visitor.Visitor<T>): T {
        return v.visitAssignmentNode(this);
    }
}