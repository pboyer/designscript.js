import { Visitor, CpsVisitor } from './Visitor';

export interface Node {
    parserState: ParserState;
    accept<T>(v: Visitor<T>) : T;
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void);
}

export class ParserState {
    firstLine: number;
    lastLine: number;
    firstCol: number;
    lastCol: number;
}

// not exported! this allows internal code sharing 
// between nodes
class ParsedNode {
    parserState: ParserState;
}

//
// Identifiers
//

export class IdentifierListNode extends ParsedNode implements Node {
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
            this.head.toString() + ', ' + this.tail.toString();
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitIdentifierListNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitIdentifierListNode(this,c);
    }
}

export class IdentifierNode extends ParsedNode implements Node {
    type: Type;
    name: string;

    constructor(id: string, t: Type = null) {
        super();
        this.name = id;
        this.type = t;
    }

    toString() {
        return this.type ? this.name + ' : ' + this.type.toString() : this.name;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitIdentifierNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitIdentifierNode(this,c);
    }
}

export class Type extends ParsedNode implements Node {
    name: string;

    constructor(t: string) {
        super();
        this.name = t;
    }

    toString() {
        return this.name;
    }
    
    accept<T>(v: Visitor<T>): T {
        throw new Error("Not implemented!");
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        throw new Error("Not implemented!");
    }
}

//
// Expressions 
//

export interface ExpressionNode extends Node {
    accept<T>(v: Visitor<T>): T;
}

export interface LiteralExpressionNode<T> extends ExpressionNode {
    value : T;
}

export class NumberNode extends ParsedNode implements LiteralExpressionNode<number> {
    value: number;

    constructor(value: string) {
        super();
        this.value = parseFloat(value);
    }

    toString() {
        return this.value;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitNumberNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitNumberNode(this, ret);
    }
}


export class BooleanNode extends ParsedNode implements LiteralExpressionNode<boolean> {
    value: boolean;

    constructor(value: string) {
        super();
        this.value = value === 'true';
    }

    toString() {
        return this.value;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitBooleanNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitBooleanNode(this,c);
    }
}

export class StringNode extends ParsedNode implements LiteralExpressionNode<string> {
    value: string;

    constructor(value: string) {
        super();
        this.value = value.slice(1, value.length - 1);
    }

    toString() {
        return this.value;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitStringNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitStringNode(this,c);
    }
}

export class ArrayNode extends ParsedNode implements ExpressionNode {
    expressionList: ExpressionListNode;

    constructor(el: ExpressionListNode) {
        super();
        this.expressionList = el;
    }

    toString() {
        return '{ ' + this.expressionList.toString() + ' }';
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitArrayNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitArrayNode(this,c);
    }
}

export class BinaryExpressionNode extends ParsedNode implements ExpressionNode {
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
        return this.firstExpression.toString() + ' ' + this.operator + ' ' + this.secondExpression.toString();
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitBinaryExpressionNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitBinaryExpressionNode(this, ret);
    }
}

export class RangeExpressionNode extends ParsedNode implements ExpressionNode {
    start: ExpressionNode;
    end: ExpressionNode;
    step: ExpressionNode;
    isStepCount: boolean;

    constructor(start: ExpressionNode, end: ExpressionNode, step: ExpressionNode = null, isStepCount = false) {
        super();
        this.start = start;
        if (end instanceof RangeExpressionNode)
            throw new Error('Multiply nested range expressions are not supported');
        this.end = end;
        if (step instanceof RangeExpressionNode)
            throw new Error('step cannot be a RangeExpression');
        this.step = step;
        this.isStepCount = isStepCount;
    }

    toString() {
        return
        this.start.toString() + '..' + this.end.toString() +
        (this.step == null ? '' :
            '..' + (this.isStepCount ? '#' : '') + this.step.toString());

    }

    accept<T>(v: Visitor<T>): T {
        return v.visitRangeExpressionNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitRangeExpressionNode(this,c);
    }
}

export class FunctionCallNode extends ParsedNode implements ExpressionNode {
    functionId: IdentifierNode;
    arguments: ExpressionListNode;

    constructor(fid: IdentifierNode, el: ExpressionListNode) {
        super();
        this.functionId = fid;
        this.arguments = el;
    }

    toString() {
        return this.functionId.toString() + '( ' + this.arguments.toString() + ' )';
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitFunctionCallNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitFunctionCallNode(this,c);
    }
}

export class ArrayIndexNode extends ParsedNode implements ExpressionNode {
    array: ExpressionNode;
    index: ExpressionNode;

    constructor(a: ExpressionNode, i: ExpressionNode) {
        super();
        this.array = a;
        this.index = i;
    }

    toString() {
        return this.array.toString() + '[ ' + this.index.toString() + ' ]';
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitArrayIndexNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitArrayIndexNode(this,c);
    }
}

export class ExpressionListNode extends ParsedNode implements Node {
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
            s = s + ', ';
            s = s + el.head.toString();
            el = el.tail;
        }
        return s;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitExpressionListNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitExpressionListNode(this,c);
    }
}

export class ReplicationExpressionNode extends ParsedNode implements ExpressionNode {
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

    accept<T>(v: Visitor<T>): T {
        return v.visitReplicationExpressionNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitReplicationExpressionNode(this,c);
    }
}

export class ReplicationGuideNode extends ParsedNode implements ExpressionNode {
    index: ExpressionNode;

    constructor(i: ExpressionNode) {
        super();
        this.index = i;
    }

    toString() {
        return '<' + this.index.toString() + '>';
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitReplicationGuideNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitReplicationGuideNode(this,c);
    }
}

export class ReplicationGuideListNode extends ParsedNode implements ExpressionNode {
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

    accept<T>(v: Visitor<T>): T {
        return v.visitReplicationGuideListNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitReplicationGuideListNode(this,c);
    }
}

//
// Statements
//

export class StatementNode extends ParsedNode implements Node {
    toString() {
        return this.toLines('').join('\n');
    }

    toLines(indent: string): string[] {
        return [];
    }
    
    accept<T>(v: Visitor<T>): T {
        throw new Error("Not implemented!")
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        throw new Error("Not implemented!")
    }
}

export class ForLoopNode extends StatementNode {
    
    init: StatementListNode;
    test: ExpressionNode;
    post: StatementNode;
    block: StatementListNode;

    constructor(init: StatementListNode, rangeCheckExpression: ExpressionNode, iterator: StatementNode, block : StatementListNode) {
        super();
        this.init = init;
        this.test = rangeCheckExpression;
        this.post = iterator;
        this.block = block;
    }

    toLines(indent: string): string[] {
        
        var inits = this.init ? this.init.toLines("").join(',') : "";
        var rangeCheck = this.test ? this.test.toString() : "";
        var iterator = this.post ? this.post.toString() : "";
        
        return [indent + 'for(' + inits + ';' + rangeCheck + ';' + iterator +'){']
            .concat(this.block.toLines(indent + '\t'))
            .concat([indent + '}']);
    }
       
    accept<T>(v: Visitor<T>): T {
        return v.visitForLoopNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitForLoopNode(this,c);
    }
}

export class WhileLoopNode extends StatementNode {
    
    test: ExpressionNode;
    block: StatementListNode;

    constructor(rangeCheckExpression: StatementListNode, block: StatementListNode) {
        super();
        this.test = rangeCheckExpression;
        this.block = block;
    }

    toLines(indent: string): string[] {
        
        var rangeCheck = this.test ? this.test.toString() : "";
        
        return [indent + 'while(' + rangeCheck + '){']
            .concat(this.block.toLines(indent + '\t'))
            .concat([indent + '}']);
    }
    
    accept<T>(v: Visitor<T>): T {
        return v.visitWhileLoopNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitWhileLoopNode(this,c);
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
        return [indent + '[' + this.name + ']{']
            .concat(this.statementList.toLines(indent + '\t'))
            .concat([indent + '}']);
    }
}

export class AssociativeBlockNode extends LanguageBlockNode {
    constructor(sl: StatementListNode) {
        super('Associative', sl);
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitAssociativeBlockNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitAssociativeBlockNode(this,c);
    }
}

export class ImperativeBlockNode extends LanguageBlockNode {
    constructor(sl: StatementListNode) {
        super('Imperative', sl);
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitImperativeBlockNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitImperativeBlockNode(this,c);
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

    toLines(indent: string) : string[] {
        var s = this.head.toLines(indent);
        var sl = this.tail;
        while (sl != null) {
            s = s.concat(sl.head.toLines(indent));
            sl = sl.tail;
        }
        return s;
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitStatementListNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitStatementListNode(this, ret);
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
        return [indent + 'if( ' + this.testExpression.toString() + ' ){']
            .concat(this.trueStatementList.toLines(indent + '\t'))
            .concat([indent + ' } else { '])
            .concat(this.falseStatementList.toLines(indent + '\t'));
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitIfStatementNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitIfStatementNode(this,c);
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
        return [indent + 'def ' + this.identifier.toString() + '( ' + this.arguments.toString() + ' ){']
            .concat(this.body.toLines('\t' + indent))
            .concat([indent + '}']);
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitFunctionDefinitionNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, c : (T) => void) {
        v.visitFunctionDefinitionNode(this,c);
    }
}

export class AssignmentNode extends ParsedNode implements ExpressionNode {
    identifier: IdentifierNode;
    expression: ExpressionNode;

    constructor(id: IdentifierNode, e: ExpressionNode) {
        super();
        this.identifier = id;
        this.expression = e;
    }

    toString() {
        return this.identifier.toString() + ' = ' + this.expression.toString();
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitAssignmentNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitAssignmentNode(this, ret);
    }
}

export class AssignmentStatementNode extends StatementNode {
    assignment: AssignmentNode;

    constructor(assignment: AssignmentNode) {
        super();
        this.assignment = assignment;
    }

    toLines(indent) {
        return [indent + this.assignment.toString() + ';'];
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitAssignmentStatementNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitAssignmentStatementNode(this, ret);
    }
}

export class ContinueStatementNode extends StatementNode {
    constructor() {
        super();
    }

    toLines(indent) {
        return [indent + "continue;"];
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitContinueStatementNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitContinueStatementNode(this, ret);
    }
}


export class BreakStatementNode extends StatementNode {
    constructor() {
        super();
    }

    toLines(indent) {
        return [indent + "break;"];
    }

    accept<T>(v: Visitor<T>): T {
        return v.visitBreakStatementNode(this);
    }
    
    cpsAccept<T>(v: CpsVisitor<T>, ret : (T) => any): T {
        return v.visitBreakStatementNode(this, ret);
    }
}
