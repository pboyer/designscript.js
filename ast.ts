import visitor = require('./visitor');

//
// IdentifierNode
//

export class IdentifierListNode { 
    id : IdentifierNode;
    il : IdentifierListNode;
    
    constructor(id : IdentifierNode, il : IdentifierListNode){
        this.id = id;
        this.il = il;
	}

    toString() {
        return this.il == null ? 
            this.id.toString() : 
            this.id.toString() + ", " + this.il.toString();
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitIdentifierListNode( this );
    }
}

export class IdentifierNode { 
    id : string;

    constructor(id : string) {
        this.id = id;
	}

    toString() {
        return this.id;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitIdentifierNode( this );
    }
}

export class TypedIdentifierNode extends IdentifierNode { 
    t : Type;

    constructor(id : string, t : Type) {
        super(id);
        this.t = t;
	}

    toString() {
        return this.id + " : " + this.t.toString();
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitTypedIdentifierNode( this );
    }
}

export class Type { 
    t : string;
    
    constructor(t : string){
        this.t = t;
    }

    toString(){
        return this.t;
    }
}

//
// Expressions 
//

export interface AssociativeNode {
    accept<T>(v : visitor.Visitor<T>) : T;
}

export class IntNode implements AssociativeNode { 
    value : Number;
    
    constructor(value : string){
        this.value = parseInt(value);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitIntNode( this );
    }
}

export class DoubleNode implements AssociativeNode { 
    value : Number;
    
    constructor(value : string){
        this.value = parseFloat(value);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitDoubleNode( this );
    }
}

export class BooleanNode implements AssociativeNode { 
    value : boolean;
    
    constructor(value : string){
        this.value = value === "true";
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitBooleanNode( this );
    }
}

export class StringNode implements AssociativeNode { 
    value : string;
    
    constructor(value : string){
        this.value = value.slice(1, value.length-1);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitStringNode( this );
    }
}

export class ArrayNode implements AssociativeNode { 
    el : ExprListNode;
    
    constructor(el : ExprListNode){
        this.el = el;
	}

    toString(){
        return "{ " + this.el.toString() + " }";
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitArrayNode( this );
    }
}

export class BinaryExpressionNode implements AssociativeNode { 
    op : string;
    lhs : AssociativeNode;
    rhs : AssociativeNode;
    
    constructor(op : string, lhs : AssociativeNode, rhs : AssociativeNode){
        this.op = op;
        this.lhs = lhs;
        this.rhs = rhs;
	}

    toString() {
        return this.lhs.toString() + " " + this.op + " " + this.rhs.toString();
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitBinaryExpressionNode( this );
    }
}

export class FunctionCallNode implements AssociativeNode { 
    fid : IdentifierNode;
    el : FuncArgExprList;
    
    constructor(fid : IdentifierNode, el : FuncArgExprList ){
        this.fid = fid;
        this.el = el;
	}

    toString() {
        return this.fid.toString() + "( " + this.el.toString() + " )";
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitFunctionCallNode( this );
    }
}

export class ArrayIndexNode implements AssociativeNode { 
    a : AssociativeNode;
    i : AssociativeNode;
    
    constructor(a : AssociativeNode, i : AssociativeNode){
        this.a = a;
        this.i = i;
    }

    toString() {
        return this.a.toString() + "[ " + this.i.toString() + " ]";
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitArrayIndexNode( this );
    }
}

export class ExprListNode { 
    e : AssociativeNode;
    el : ExprListNode;

    constructor(e : AssociativeNode, el : ExprListNode ){
        this.e = e;
        this.el = el;
	}

    toString() {
        var s = this.e.toString();
        var el = this.el;
        while (el != null){
            s = s + ", ";
            s = s + el.e.toString();
            el = el.el;
        }
        return s;
    } 
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitExprListNode( this );
    }
}

//
// Statements
//

export class StmtNode {
    toString() {
        return this.toLines("").join("\n");
    }

    toLines( indent : string ) : string[] {
        return [];    
    }
}

export class StmtList extends StmtNode { 
    s : StmtNode;
    sl : StmtList;
    
    constructor(s : StmtNode, sl : StmtList){
        super();
        this.s = s;
        this.sl = sl;
	}

    toLines( indent : string ){
        var s = this.s.toLines( indent );
        var sl = this.sl;
        while (sl != null){
            s = s.concat( sl.s.toLines( indent ) );
            sl = sl.sl;
        }
        return s;
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitStmtList( this );
    }
}

export class IfStatementNode extends StmtNode { 
    test : AssociativeNode;
    tsl : StmtList;
    fsl : StmtList;

    constructor( test : AssociativeNode, tsl : StmtList, fsl : StmtList ){
        super();
        this.test = test;
        this.tsl = tsl;
        this.fsl = fsl;
	}

    toLines( indent : string ) {
        return [ indent + "if( " + this.test.toString() + " ){" ]
            .concat( this.tsl.toLines( indent + "\t" ) )
            .concat( [" } else { "] )
            .concat( this.fsl.toLines( indent + "\t" ) );
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitIfStatementNode( this );
    }
}

export class FunctionDefinitionNode extends StmtNode { 
    id : IdentifierNode;
    il : IdentifierListNode;
    sl : StmtList;
    
    constructor(id : IdentifierNode, il : IdentifierListNode, sl : StmtList ){
        super();
        this.id = id;
        this.il = il;
        this.sl = sl;
	}

    toLines( indent : string ) {
        return [ indent + "def " + this.id.toString() + "( " + this.il.toString() + " ){" ]
            .concat( this.sl.toLines( "\t" + indent ) )
            .concat( [ indent + "}" ] );
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitFunctionDefinitionNode( this );
    }
}

export class AssignmentNode extends StmtNode { 
    id : IdentifierNode;
    e : AssociativeNode;

    constructor(id : IdentifierNode, e : AssociativeNode){
        super();
        this.id = id;
        this.e = e;
	}

    toLines( indent ) {
        return [ indent + this.id.toString() + " = " + this.e.toString() + ";" ];
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitAssignmentNode( this );
    }
}

export class ReturnNode extends StmtNode { 
    e : AssociativeNode;

    constructor(e : AssociativeNode){
        super();
        this.e = e;
	}

    toLines( indent ){
        return [ indent + "return = " + this.e.toString() + ";" ];
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitReturnNode( this );
    }
}

// 
// Replication guides
//
export class FuncArgExprList { 
    fa : FuncArgExpr;
    fal : FuncArgExprList;
    
    constructor(fa : FuncArgExpr, fal : FuncArgExprList ){
        this.fa = fa;
        this.fal = fal;
	}

    toString() {
        var s = this.fa.toString();
        var fal = this.fal;
        while( fal != null ){
            s += ", ";
            s += fal.fa.toString();
        }

        return s;
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitFuncArgExprList( this );
    }
}

export class FuncArgExpr implements AssociativeNode { 
    e : AssociativeNode;
    ri : Number;
    
    constructor(e : AssociativeNode, ri : Number){
        this.e = e;
        this.ri = ri;
	}

    toString(){
        return this.e.toString() + "<" + this.ri + ">";
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitFuncArgExpr( this );
    }
}

