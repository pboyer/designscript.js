import visitor = require('./visitor');

export class Node {
    firstLine : number;
    lastLine : number;
    firstCol : number;
    lastCol : number;
}

//
// IdentifierNode
//

export class IdentifierListNode extends Node { 
    id : IdentifierNode;
    il : IdentifierListNode;
    
    constructor(id : IdentifierNode, il : IdentifierListNode){
        super();
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

export class IdentifierNode extends Node { 
    id : string;

    constructor(id : string) {
        super();
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

export class Type extends Node { 
    t : string;
    
    constructor(t : string){
        super();
        this.t = t;
    }

    toString(){
        return this.t;
    }
}

//
// Expressions 
//

export interface AssociativeNode  {
    accept<T>(v : visitor.Visitor<T>) : T;
}

export class IntNode extends Node implements AssociativeNode { 
    value : Number;
    
    constructor(value : string){
        super();
        this.value = parseInt(value);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitIntNode( this );
    }
}

export class DoubleNode extends Node implements AssociativeNode { 
    value : Number;
    
    constructor(value : string){
        super();
        this.value = parseFloat(value);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitDoubleNode( this );
    }
}

export class BooleanNode extends Node implements AssociativeNode { 
    value : boolean;
    
    constructor(value : string){
        super();
        this.value = value === "true";
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitBooleanNode( this );
    }
}

export class StringNode extends Node implements AssociativeNode { 
    value : string;
    
    constructor(value : string){
        super();
        this.value = value.slice(1, value.length-1);
	}

    toString() {
        return this.value;
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitStringNode( this );
    }
}

export class ArrayNode extends Node implements AssociativeNode { 
    el : ExpressionListNode;
    
    constructor(el : ExpressionListNode){
        super();
        this.el = el;
	}

    toString(){
        return "{ " + this.el.toString() + " }";
    }
    
    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitArrayNode( this );
    }
}

export class BinaryExpressionNode extends Node implements AssociativeNode { 
    op : string;
    lhs : AssociativeNode;
    rhs : AssociativeNode;
    
    constructor(op : string, lhs : AssociativeNode, rhs : AssociativeNode){
        super();
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

export class FunctionCallNode extends Node implements AssociativeNode { 
    fid : IdentifierNode;
    el : ExpressionListNode;
    
    constructor(fid : IdentifierNode, el : ExpressionListNode ){
        super();
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

export class ArrayIndexNode extends Node implements AssociativeNode { 
    a : AssociativeNode;
    i : AssociativeNode;
    
    constructor(a : AssociativeNode, i : AssociativeNode){
        super();
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

export class ExpressionListNode extends Node { 
    e : AssociativeNode;
    el : ExpressionListNode;

    constructor(e : AssociativeNode, el : ExpressionListNode ){
        super();
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
        return v.visitExpressionListNode( this );
    }
}

export class ReplicationExpressionNode extends Node implements AssociativeNode { 
    e : AssociativeNode;
    ril : ReplicationGuideListNode;
    
    constructor(e : IdentifierNode, ril : ReplicationGuideListNode){
        super();
        this.e = e;
        this.ril = ril;
	}

    toString(){
        return this.e.toString() + this.ril.toString();
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitReplicationExpressionNode( this );
    }
}

export class ReplicationGuideNode extends Node implements AssociativeNode { 
    i : AssociativeNode;
    
    constructor(i : AssociativeNode){
        super();
        this.i = i;
	}

    toString(){
        return "<" + this.i.toString() + ">";
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitReplicationGuideNode( this );
    }
}

export class ReplicationGuideListNode extends Node implements AssociativeNode { 
    ri : ReplicationGuideNode;
    ril : ReplicationGuideListNode;
    
    constructor(ri : ReplicationGuideNode, ril : ReplicationGuideListNode = null){
        super();
        this.ri = ri;
	    this.ril = ril;
    }

    toString(){
        return this.ri.toString() + this.ril.toString();
    }

    accept<T>(v : visitor.Visitor<T>) : T {
        return v.visitReplicationGuideListNode( this );
    }
}

//
// Statements
//

export class StatementNode extends Node {
    toString() {
        return this.toLines("").join("\n");
    }

    toLines( indent : string ) : string[] {
        return [];    
    }
}

export class StatementListNode extends StatementNode { 
    s : StatementNode;
    sl : StatementListNode;
    
    constructor(s : StatementNode = null, sl : StatementListNode = null){
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
        return v.visitStatementListNode( this );
    }
}

export class IfStatementNode extends StatementNode { 
    test : AssociativeNode;
    tsl : StatementListNode;
    fsl : StatementListNode;

    constructor( test : AssociativeNode, tsl : StatementListNode, fsl : StatementListNode ){
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

export class FunctionDefinitionNode extends StatementNode { 
    id : IdentifierNode;
    il : IdentifierListNode;
    sl : StatementListNode;
    
    constructor(id : IdentifierNode, il : IdentifierListNode, sl : StatementListNode ){
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

export class AssignmentNode extends StatementNode { 
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

export class ReturnNode extends StatementNode { 
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

