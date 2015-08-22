import * as AST from './AST';
import { Environment } from './Environment';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { Replicator } from './Replicator';
import { Range } from './Range';

export interface CpsVisitor<T> {
    visitIdentifierNode(node: AST.IdentifierNode, ret: (T) => void);
    visitIdentifierListNode(node: AST.IdentifierListNode, ret: (T) => void);
    visitNumberNode(node: AST.NumberNode, ret: (T) => void);
    visitBooleanNode(node: AST.BooleanNode, ret: (T) => void);
    visitStringNode(node: AST.StringNode, ret: (T) => void);
    visitArrayNode(node: AST.ArrayNode, ret: (T) => void);
    visitBinaryExpressionNode(node: AST.BinaryExpressionNode, ret: (T) => void);
    visitRangeExpressionNode(node: AST.RangeExpressionNode, ret: (T) => void);
    visitFunctionCallNode(node: AST.FunctionCallNode, ret: (T) => void);
    visitArrayIndexNode(node: AST.ArrayIndexNode, ret: (T) => void);
    visitExpressionListNode(node: AST.ExpressionListNode, ret: (T) => void);
    visitStatementListNode(node: AST.StatementListNode, ret: (T) => void);
    visitIfStatementNode(node: AST.IfStatementNode, ret: (T) => void);
    visitFunctionDefinitionNode(node: AST.FunctionDefinitionNode, ret: (T) => void);
    visitAssignmentNode(node: AST.AssignmentNode, ret: (T) => void);
    visitReplicationExpressionNode(node: AST.ReplicationExpressionNode, ret: (T) => void);
    visitReplicationGuideNode(node: AST.ReplicationGuideNode, ret: (T) => void);
    visitReplicationGuideListNode(node: AST.ReplicationGuideListNode, ret: (T) => void);
    visitImperativeBlockNode(node: AST.ImperativeBlockNode, ret: (T) => void);
    visitAssociativeBlockNode(node: AST.AssociativeBlockNode, ret: (T) => void);
}

export class ImperativeInterpreter implements CpsVisitor<any> {

    env: Environment = new Environment();

    constructor(debug?: (a: AST.Node, ret: () => void) => void) {
        if (debug) {
            this.debug = debug;
        }
        
        this.addBuiltins();
    }
    
    private addBuiltins() {
        this.env.set('print', new TypedFunction((x) => console.log(x), [new TypedArgument('a', 'var')], 'print'));
    }
    
    // default continuation
    debug: (a: AST.Node, ret: () => void) => void = (a, ret) => {
        // by default
        ret();
    }
	
    // passes control to someone else
    private step(node: AST.Node, ret: () => void) {
        if (this.debug) {
            this.debug(node, ret)
        } else {
            ret();
        }
    }

    run(node: AST.StatementListNode, ret?: (any) => any) {
        if (!ret) ret = () => {};
        
        this.evalFunctionDefinitionNodes(node, () => {
            this.visitStatementListNode(node, ret);
        });
    }

    evalFunctionDefinitionNodes(node: AST.StatementListNode, ret: (any) => any) {
        var iterate = (n, r) => {
            if (!n.head) {
                ret(r);
            } else if (n.head instanceof AST.FunctionDefinitionNode) {
                n.head.cpsAccept(this, (x) => iterate(n.tail, x));
            } else {
                iterate(n.tail, r);
            }
        };

        iterate(node, undefined);
    }

    visitStatementListNode(node: AST.StatementListNode, ret: (any) => any) {
        this.step(node, () => {
            var iterate = (n, r) => {
                if (!n || !n.head) {
                    ret(r);
                } else if (n.head instanceof AST.FunctionDefinitionNode) {
                    // ignore function definitions
                    iterate(n.tail, r);
                } else {
                    n.head.cpsAccept(this, (x) => iterate(n.tail, x));
                }
            };

            iterate(node, undefined);
        });
    }

    visitIdentifierNode(node: AST.IdentifierNode, ret: (any) => any) {
        this.step(node, () => {
            ret(this.env.lookup(node.name))
        });
    }

    visitBooleanNode(node: AST.BooleanNode, ret: (T) => void) {
        this.step(node, () => ret(node.value));
    }

    visitStringNode(node: AST.StringNode, ret: (T) => void) {
        this.step(node, () => ret(node.value));
    }

    visitNumberNode(node: AST.NumberNode, ret: (number) => any) {
        this.step(node, () => ret(node.value));
    }

    visitBinaryExpressionNode(node: AST.BinaryExpressionNode, ret: (any) => any) {
        this.step(node, () => {
            // evaluate first expression
            node.firstExpression.cpsAccept(this, (a) => {
                // evaluate second
                node.secondExpression.cpsAccept(this, (b) => {
                    // evaluate
                    switch (node.operator) {
                        case '+':
                            return ret(a + b);
                        case '-':
                            return ret(a - b);
                        case '*':
                            return ret(a * b);
                        case '<':
                            return ret(a < b);
                        case '||':
                            return ret(a || b);
                        case '==':
                            return ret(a == b);
                        case '>':
                            return ret(a > b);
                    }
                    
                    throw this.error('Unknown binary operator type', node.parserState);
                });
            });
        });
    }

    visitAssignmentNode(node: AST.AssignmentNode, ret: (any) => any) {
        this.step(node, () => {
            // evaluate expression
            node.expression.cpsAccept(this, (e) => {
                // store the value
                this.env.set(node.identifier.name, e);
                ret(e);
            });
        });
    }

    visitFunctionCallNode(node: AST.FunctionCallNode, ret: (T) => void) {
        this.step(node, () => {
            var f: TypedFunction = this.env.lookup(node.functionId.name);

            node.arguments.cpsAccept(this, (args) => {
                args.push(ret); // last arg is the continuation
                f.func.apply(undefined, args);
                // TODO Replicator.cpsReplicate(f, args, ret)
            });
        });
    }

    visitExpressionListNode(node: AST.ExpressionListNode, ret: (T) => void) {
        this.step(node, () => {
            var iterate = (n, a) => {
                if (!n || !n.head) {
                    ret(a);
                } else {
                    n.head.cpsAccept(this, (x) => {
                        a.push(x);
                        iterate(n.tail, a);
                    });
                }
            };

            iterate(node, []);
        });
    }

    visitFunctionDefinitionNode(fds: AST.FunctionDefinitionNode, ret: (T) => void) { 
 
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

    apply(fd: AST.FunctionDefinitionNode, env: Environment, args: any[], ret: (T) => void) {
        env = new Environment(env);

        // bind
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            env.set(il.head.name, args[i++]);
            il = il.tail;
        };

        var current = this.env;
        this.env = env;

        // evaluate the body
        fd.body.cpsAccept(this, (x) => {
            // return to the original environment
            this.env = current;
            ret(x);
        });
    }

    visitArrayIndexNode(node: AST.ArrayIndexNode, ret: (T) => void) {
        this.step(node, () => {
            // evaluate the array
            node.array.cpsAccept(this, (arr) => {
                // get the index and return
                node.index.cpsAccept(this, (i) => ret(arr[i]))
            });
        });
    }

    visitArrayNode(node: AST.ArrayNode, ret: (T) => void) {
        this.step(node,() => 
            node.expressionList.cpsAccept(this, ret)
        );
    }

    visitIfStatementNode(node: AST.IfStatementNode, ret: (T) => void) {
        this.step(node, () => {
            node.testExpression.cpsAccept(this, (test) => {
                test ?
                    node.trueStatementList.cpsAccept(this, ret)
                    : node.falseStatementList.cpsAccept(this, ret);
            })
        });
    }

    visitImperativeBlockNode(node: AST.ImperativeBlockNode, ret: (T) => void) {
        this.step(node, () => {
            node.statementList.cpsAccept( 
                new ImperativeInterpreter(this.debug), 
                ret );
        });
    }

    visitRangeExpressionNode(node: AST.RangeExpressionNode, ret: (T) => void) {
        this.step(node, () => {
            node.start.cpsAccept(this, (start) => {
                if (typeof start != 'number') throw this.error('start must be a number.', node.parserState);

                node.end.cpsAccept(this, (end) => {
                    if (typeof end != 'number') throw this.error('end must be a number.', node.parserState);

                    if (!node.step) return ret(Range.byStartEnd(start, end));

                    node.step.cpsAccept(this, (step) => {
                        if (typeof step != 'number') throw this.error('step must be a number.', node.parserState);

                        ret(node.isStepCount ?
                            Range.byStepCount(start, end, step) :
                            Range.byStepSize(start, end, step));
                    });
                });
            });
        });
    }

    visitReplicationExpressionNode(node: AST.ReplicationExpressionNode, ret: (T) => void) {
        
    }
    
    visitReplicationGuideNode(node: AST.ReplicationGuideNode, ret: (T) => void) {
        
    }
    
    visitReplicationGuideListNode(node: AST.ReplicationGuideListNode, ret: (T) => void) { throw new Error("Not implemented"); }
    visitAssociativeBlockNode(node: AST.AssociativeBlockNode, ret: (T) => void) { throw new Error("Not implemented"); }

    visitIdentifierListNode(node: AST.IdentifierListNode, ret: (T) => void) { throw new Error("Not implemented"); }

    error(message: string, state: AST.ParserState): DesignScriptError {
        return new DesignScriptError(message, state);
    }
}