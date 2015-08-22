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
                        ret( r );
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
                var f : TypedFunction = this.env.lookup( node.functionId.name );
                
                node.arguments.cpsAccept(this, (args) => {
                    args.push(ret); // last arg is the continuation
                    f.func.apply( undefined, args );
                });
			}
		);
        // Replicator.cpsReplicate(f, args, ret)
    }

    visitExpressionListNode(node : AST.ExpressionListNode, ret : (T) => void){ 
        this.step( node, 
			() => {
                var iterate = (n, a) => {
                    if (!n.head) {
                        ret(a);
                    } else {
                        n.head.cpsAccept( this, (x) => { 
                            a.push(x); 
                            iterate( n.tail, a );  
                        });
                    }
                };
                
                iterate( node, [] );
			}
		);
    }
    
    visitFunctionDefinitionNode(fds : AST.FunctionDefinitionNode, ret : (T) => void){ 
 
        // unpack the argument list 
        var il = fds.arguments;
        var val = [];
        while (il != undefined) {
            var t = il.head.type;
            val.push(new TypedArgument(il.head.name, t ? t.name : undefined));

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

        fd = new TypedFunction(f, val, fds.identifier.name);

        this.env.set(fds.identifier.name, fd);
        
        ret(undefined);
    }
    
    apply(fd: AST.FunctionDefinitionNode, env: Environment, args: any[], ret : (T) => void ){
        env = new Environment(env);

        // bind the arguments in the scope 
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            env.set(il.head.name, args[i++]);
            il = il.tail;
        };

        var current = this.env;
        this.env = env;

        fd.body.cpsAccept(this, (x) => {
            this.env = current;
            ret(x)
        });
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