import * as AST from './AST';
import { Environment } from './Environment';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { Replicator } from './Replicator';

export interface CpsVisitor<T> {
    visitIdentifierNode(node : AST.IdentifierNode, ret : (T) => void);
    visitIdentifierListNode(node : AST.IdentifierListNode, ret : (T) => void);
    visitNumberNode(node : AST.NumberNode, ret : (T) => void);
    visitBooleanNode(node : AST.BooleanNode, ret : (T) => void);
    visitStringNode(node : AST.StringNode, ret : (T) => void);
    visitArrayNode(node : AST.ArrayNode, ret : (T) => void);
    visitBinaryExpressionNode(node : AST.BinaryExpressionNode, ret : (T) => void);
    visitRangeExpressionNode(node : AST.RangeExpressionNode, ret : (T) => void);
    visitFunctionCallNode(node : AST.FunctionCallNode, ret : (T) => void);
    visitArrayIndexNode(node : AST.ArrayIndexNode, ret : (T) => void);
    visitExpressionListNode(node : AST.ExpressionListNode, ret : (T) => void);
    visitStatementListNode(node : AST.StatementListNode, ret : (T) => void);
    visitIfStatementNode(node : AST.IfStatementNode, ret : (T) => void);
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode, ret : (T) => void);
    visitAssignmentNode(node : AST.AssignmentNode, ret : (T) => void);
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode, ret : (T) => void);
    visitReplicationGuideNode(node : AST.ReplicationGuideNode, ret : (T) => void);
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode, ret : (T) => void);
    visitImperativeBlockNode(node : AST.ImperativeBlockNode, ret : (T) => void);
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode, ret : (T) => void);
}

export class CpsInterpreter implements CpsVisitor<any> {
	
	env: Environment = new Environment();
    
    constructor( debug : (a : AST.Node, ret : () => void) => void ){
        if (debug){
            this.debug = debug;
        }
    }
    
    // default continuation
	debug : (a : AST.Node, ret : () => void) => void = (a,ret) => {
        // by default
        ret();
    }
	
    // passes control to someone else
	step( node : AST.Node, ret : () => void){
		if (this.debug) {
            this.debug( node, ret )
        } else {
            ret();
        }
	}
	
	visitStatementListNode(node : AST.StatementListNode, ret : (any) => any){
        this.step( node, 
            () => {  
                var iterate = (n,r) => {
                    if (!n.head) {
                        return ret( r );
                    } else {
                        n.head.cpsAccept( this, (x) => iterate( n.tail, x ) );
                    }
                };
                
                iterate( node, undefined );
            }
        );
	}
	
    visitIdentifierNode(node : AST.IdentifierNode, ret : (any) => any){
        this.step( node, 
			() => {
                ret( this.env.lookup(node.name) )
            }
		);
	}
	
    visitNumberNode(node : AST.NumberNode, ret : (number) => any){
        this.step( node, 
			() => ret( node.value )
		);
	}
	
	visitBinaryExpressionNode(node : AST.BinaryExpressionNode, ret : (any) => any){
		this.step( node, 
			() => {
				// evaluate first expression
				node.firstExpression.cpsAccept( this, 
					// evaluate second
					(a) => node.secondExpression.cpsAccept( this, 
                        // return the sum
                        // TODO include all of the type operators
						(b) => ret( a + b )
					)
				)
			}
		);
	}
	
    visitAssignmentNode(node : AST.AssignmentNode, ret : (any) => any){
        this.step( node, 
			() => {
				// evaluate first expression
				node.expression.cpsAccept( this, 
                    // store the value
					(e) => {
                        this.env.set(node.identifier.name, e);
                        ret(e);
                    }
                )
			}
		);
	}
    
    visitFunctionCallNode(node : AST.FunctionCallNode, ret : (T) => void){ 
        this.step( node, 
			() => {
                var f = this.env.lookup( node.functionId.name );
                node.arguments.cpsAccept(this, (args) => ret( Replicator.replicate(f, args) ));
			}
		);
    }

    visitExpressionListNode(node : AST.ExpressionListNode, ret : (T) => void){ 
        this.step( node, 
			() => {
                var args = [];
                var iterate = (n) => {
                    if (!n.head) {
                        return ret(args);
                    } else {
                        n.head.cpsAccept( this, (x) => { 
                            args.push(x); 
                            iterate( n.tail );  
                        });
                    }
                };
                
                iterate( node );
			}
		);
    }
    
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode, ret : (T) => void){ 
        
    }
    
    apply(f : TypedFunction, args : any[], ret : (T) => void ){
        
    }
    	
    visitIdentifierListNode(node : AST.IdentifierListNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitArrayIndexNode(node : AST.ArrayIndexNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitIfStatementNode(node : AST.IfStatementNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitReplicationGuideNode(node : AST.ReplicationGuideNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitImperativeBlockNode(node : AST.ImperativeBlockNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode, ret : (T) => void){ throw new Error("Not implemented"); }
    
    // easy
    visitBooleanNode(node : AST.BooleanNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitStringNode(node : AST.StringNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitArrayNode(node : AST.ArrayNode, ret : (T) => void){ throw new Error("Not implemented"); }
    visitRangeExpressionNode(node : AST.RangeExpressionNode, ret : (T) => void){ throw new Error("Not implemented"); }
    
    error(message : string, state: AST.ParserState ) : DesignScriptError {
        return new DesignScriptError( message, state );
    }
}