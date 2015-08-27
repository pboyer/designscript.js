import * as AST from './AST';
import { Environment } from './Environment';
import { TypedFunction, TypedArgument, ReplicatedExpression, DesignScriptError } from './RuntimeTypes';
import { Replicator } from './Replicator';
import { Range } from './Range';
import { CpsVisitor } from './Visitor';
import { ImperativeInterpreter } from './ImperativeInterpreter';

export class DependencyNode {
    private static gid: number = 0;

    id: number = DependencyNode.gid++;
    
    private dirty: boolean = true;
    inputs: DependencyNode[] = [];
    outputs: DependencyNode[] = [];
    value: any = null;
    f: (...any: any[]) => any;

    // Make a DependencyNode from a function that is in continuation passing style
    // e.g. function(arg1, ... , argn, callback )
    constructor(f: (...any: any[]) => any) {
        this.f = f;
    }

    static constant(val: any): DependencyNode {
        // the constant node function is passed a single argument, the callback
        // it simply invokes that function with the constant as the argument
        var n = new DependencyNode((c) => c(val));
        n.dirty = false;
        n.value = val;
        return n;
    }
    
    // Make a DependencyNode from a function that is not in continuation passing style
    static byFunction(f: (...any: any[]) => any): DependencyNode {
        return new DependencyNode(function() {
            // we obtain the arguments
            var args = Array.prototype.slice.call(arguments);
            
            // get the callback
            var c = args.pop();
            
            // call the synchronous function
            c(f.apply(undefined, args));
        });
    }

    // evaluate the function, storing it in the value field
    eval(ret: (DependencyNode) => void) {
        // obtain the cached value of the dependencies
        // they should have already been evaluated
        var args = this.inputs.map((x) => x.value);
        
        // we add on the ret function as the final argument
        args.push((v) => {
            this.value = v;
            this.dirty = false;
            ret(this);
        });
        
        // invoke the funcuton
        this.f.apply(undefined, args);
    }
}

function connect(s: DependencyNode, e: DependencyNode, i: number) {
    if (s === e) throw new Error('Cannot connect a node to itself');

    s.outputs.push(e);
    e.inputs[i] = s;
}

function disconnect(s: DependencyNode, e: DependencyNode, i: number) {
    var i = s.outputs.indexOf(e)
    s.outputs.splice(i, 1);

    e.inputs[i] = null;
}

export class AssociativeInterpreter implements CpsVisitor<DependencyNode> {

    env: Environment = new Environment();

    constructor(debug?: (a: AST.Node, ret: () => void) => void) {
        if (debug) {
            this.debug = debug;
        }

        this.addBuiltins();
    }
    
    // default continuation
    debug: (a: AST.Node, ret: () => void) => void = (a, ret) => {
        // by default
        ret();
    }

    run(node: AST.StatementListNode, ret?: (any) => any) {
        if (!ret) ret = () => { };

        this.evalFunctionDefinitionNodes(node, () => {
            this.visitStatementListNode(node, ret);
        });
    }

    private addBuiltins() {
        this.env.set('print', TypedFunction.byFunction((x) => console.log(x), [new TypedArgument('a', 'var')], 'print'));
    }
	
    // passes control to someone else
    private step(node: AST.Node, ret: () => void) {
        if (this.debug) {
            this.debug(node, ret);
        } else {
            ret();
        }
    }

    evalFunctionDefinitionNodes(node: AST.StatementListNode, ret: (DependencyNode) => any) {
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

    visitStatementListNode(node: AST.StatementListNode, ret: (DependencyNode) => any) {
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

    visitIdentifierNode(node: AST.IdentifierNode, ret: (DependencyNode) => any) {
        this.step(node, () => {
            ret(this.env.lookup(node.name))
        });
    }

    private literal<V>(node: AST.LiteralExpressionNode<V>, ret: (DependencyNode) => void) {
        this.step(node, () => ret( DependencyNode.constant(node.value) ));
    }

    visitBooleanNode(node: AST.BooleanNode, ret: (boolean) => void) {
        this.literal<boolean>(node, ret);
    }

    visitStringNode(node: AST.StringNode, ret: (string) => void) {
        this.literal<string>(node, ret);
    }

    visitNumberNode(node: AST.NumberNode, ret: (number) => any) {
        this.literal<number>(node, ret);
    }

    visitBinaryExpressionNode(node: AST.BinaryExpressionNode, ret: (DependencyNode) => any) {
        this.step(node, () => {
            // evaluate first expression
            node.firstExpression.cpsAccept(this, (a) => {
                // evaluate second
                node.secondExpression.cpsAccept(this, (b) => {

                    var n: DependencyNode;

                    // evaluate
                    switch (node.operator) {
                        case '+':
                            n = DependencyNode.byFunction((a, b) => a + b);
                            break;
                        case '-':
                            n = DependencyNode.byFunction((a, b) => a - b);
                            break;
                        case '*':
                            n = DependencyNode.byFunction((a, b) => a * b);
                            break;
                        case '<':
                            n = DependencyNode.byFunction((a, b) => a < b);
                            break;
                        case '||':
                            n = DependencyNode.byFunction((a, b) => a || b);
                            break;
                        case '==':
                            n = DependencyNode.byFunction((a, b) => a == b);
                            break;
                        case '>':
                            n = DependencyNode.byFunction((a, b) => a > b);
                            break;
                        default:
                            throw this.error('Unknown binary operator type', node.parserState);
                    }
                    
                    connect(a, n, 0);
                    connect(b, n, 1);

                    n.eval(ret);
                });
            });
        });
    }

    visitAssignmentNode(node: AST.AssignmentNode, ret: (DependencyNode) => any) {
        this.step(node, () => {
            // evaluate expression
            node.expression.cpsAccept(this, (e) => {
                // store the value
                this.env.set(node.identifier.name, e);
                ret(e);
            });
        });
    }

    visitFunctionCallNode(node: AST.FunctionCallNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            this.visitExpressionListNode(node.arguments, (args) => {
                var f = this.env.lookup(node.functionId.name);

                // by putting the instanceof operator in the test expr the 
                // typescript compiler checks types in the conditional body
                if (f instanceof TypedFunction) {
                    var n = new DependencyNode(function() { 
                        // the arguments include the callback...
                        var fargs = Array.prototype.slice.call(arguments);
                        
                        // so we extract the callback...
                        var cb = fargs.pop();
                        
                        // and replicate
                        Replicator.cpsreplicate(f, fargs, cb);
                    });
      
                    // connect all of the upstream nodes
                    args.forEach((x, i) => connect(x, n, i));

                    // we eagerly evaluate the node passing it ret
                    n.eval(ret);
                    return;
                }

                throw this.error(node.functionId.name + ' is not a function.', node.parserState);
            });
        });
    }

    visitFunctionDefinitionNode(fds: AST.FunctionDefinitionNode, ret: (DependencyNode) => void) { 
 
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
            // obtain the arguments object as an array
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

    apply(fd: AST.FunctionDefinitionNode, env: Environment, args: any[], ret: (DependencyNode) => void) {
        env = new Environment(env);

        // bind
        var i = 0;
        var il = fd.arguments;
        while (il != null) {
            // set the value without calling the function
            env.set(il.head.name, DependencyNode.constant(args[i++]));
            il = il.tail;
        };
       
        var current = this.env;
        this.env = env;

        // evaluate the body
        fd.body.cpsAccept(this, (x) => {
            // return to the original environment
            this.env = current;
            ret(x.value);
        });
    }

    visitArrayIndexNode(node: AST.ArrayIndexNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            // get the array node
            node.array.cpsAccept(this, (an) => {
                // get the index node
                node.index.cpsAccept(this, (ai) => {
                    // build the node extracting the array index
                    var n = new DependencyNode((a, i, c) => c(a[i]));
                    
                    // connect the nodes
                    connect(an, n, 0);
                    connect(ai, n, 1);
                    
                    // evaluate
                    n.eval(ret);
                });
            });
        });
    }

    visitArrayNode(node: AST.ArrayNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            node.expressionList.cpsAccept(this, (els) => {
                var n = DependencyNode.byFunction(function(){
                    return Array.prototype.slice.call(arguments);
                });
                
                els.forEach((x,i) => connect(x,n,i));
                
                n.eval(ret);
            });
        });
    }
    
    visitExpressionListNode(node: AST.ExpressionListNode, ret: (DependencyNode) => void) {
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

    visitIfStatementNode(node: AST.IfStatementNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            node.testExpression.cpsAccept(this, (test) => {
                test.value ?
                    node.trueStatementList.cpsAccept(this, ret)
                    : node.falseStatementList.cpsAccept(this, ret);
            })
        });
    }

    visitRangeExpressionNode(node: AST.RangeExpressionNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            node.start.cpsAccept(this, (start) => {
                if (typeof start.value != 'number') throw this.error('start must be a number.', node.parserState);

                node.end.cpsAccept(this, (end) => {
                    if (typeof end.value != 'number') throw this.error('end must be a number.', node.parserState);

                    if (!node.step) {
                        var n = DependencyNode.byFunction(Range.byStartEnd);

                        connect(start, n, 0);
                        connect(end, n, 1);

                        n.eval(ret);
                        return;
                    }

                    node.step.cpsAccept(this, (step) => {
                        if (typeof step.value != 'number') throw this.error('step must be a number.', node.parserState);

                        var f = node.isStepCount ?
                            Range.byStepCount :
                            Range.byStepSize;

                        var n = DependencyNode.byFunction(f);
                        connect(start, n, 0);
                        connect(end, n, 1);
                        connect(step, n, 2);

                        n.eval(ret);
                    });
                });
            });
        });
    }

    visitReplicationGuideNode(node: AST.ReplicationGuideNode, ret: (DependencyNode) => void) {
        this.step(node, () => node.index.cpsAccept(this, ret));
    }

    visitReplicationExpressionNode(node: AST.ReplicationExpressionNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            node.expression.cpsAccept(this, (e) => {
                node.replicationGuideList.cpsAccept(this, (rl) => {
                    var n = DependencyNode.byFunction((e, rl) => new ReplicatedExpression(e, rl));

                    connect(e, n, 0);
                    connect(e, n, 1);

                    n.eval(ret);
                });
            });
        });
    }

    visitReplicationGuideListNode(node: AST.ReplicationGuideListNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            // simply collect the arguments and return as an array
            var n = DependencyNode.byFunction(function() { return Array.prototype.slice.call(arguments); })
            
            // connect all of the inputs
            var i = 0;
            var iterate = (n) => {
                if (!n || !n.head) {
                    n.eval(ret);
                } else {
                    n.head.cpsAccept(this, (x) => {
                        connect(x, n, i++);
                        iterate(n.tail);
                    });
                }
            };

            iterate(node);
        });
    }

    visitAssociativeBlockNode(node: AST.AssociativeBlockNode, ret: (DependencyNode) => void) { 
        this.step(node, () => {
            // build a dependency node that when evaluated...
            var n = new DependencyNode(function(c){
                // runs the associative block
                node.statementList.cpsAccept(
                    // in a new interpreter
                    new AssociativeInterpreter(this.debug), 
                    // and extracts the resultant value from the evaluated DependencyNode
                    (n) => c(n.value) );
            }.bind(this));
            // go...
            n.eval(ret);
        });
    }
    
    visitImperativeBlockNode(node: AST.ImperativeBlockNode, ret: (DependencyNode) => void) {
        this.step(node, () => {
            // build a dependency node that when evaluated...
            var n = new DependencyNode(function(c){
                // runs the imperative block
                node.statementList.cpsAccept(
                    // in a new interpreter
                    new ImperativeInterpreter(this.debug), 
                    // and turns the resultant value into a constant
                    c );
            }.bind(this));
            // go...
            n.eval(ret);
        });
    }

    visitIdentifierListNode(node: AST.IdentifierListNode, ret: (DependencyNode) => void) { throw new Error("Not implemented"); }

    error(message: string, state: AST.ParserState): DesignScriptError {
        return new DesignScriptError(message, state);
    }
}