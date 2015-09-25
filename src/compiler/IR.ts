import * as AST from '../AST';
import { Label, Temp } from "./Frame";
import { Visitor } from "../Visitor";
import * as Tree from "./Tree";

export class IR implements Visitor<Tree.Ex> {
    
    visitNumberNode(node : AST.NumberNode) : Tree.Ex {
        return new Tree.Ex(new Tree.CONST(node.value));
    }
    
    visitBooleanNode(node : AST.BooleanNode) : Tree.Ex {
        return new Tree.Ex(new Tree.CONST(node.value));
    }
    
    visitStringNode(node : AST.StringNode) : Tree.Ex {
        return new Tree.Ex(new Tree.CONST(node.value));
    }
    
    visitBinaryExpressionNode(node : AST.BinaryExpressionNode) : Tree.Ex {
        return new Tree.Ex(new Tree.BINOP(
                node.operator, 
                node.firstExpression.accept(this), 
                node.secondExpression.accept(this)));
    }
    
    visitIdentifierNode(node : AST.IdentifierNode) : Tree.Ex {
        return new Tree.Ex(new Tree.LABEL(new Label()));
    }
    
    visitAssignmentNode(node : AST.AssignmentNode) : Tree.Ex {
        return new Tree.Ex(
            new Tree.MOVE( 
                node.identifier.accept(this), 
                node.expression.accept(this)));
    }
       
    visitStatementListNode(node : AST.StatementListNode) : Tree.Ex {
        var currentNode = node;
        var seq0 = new Tree.SEQ();
        var seq = seq0;
        
        while(currentNode && currentNode.head){
            seq.left = currentNode.head.accept(this);
            currentNode = currentNode.tail;
            if (currentNode && currentNode.head){
                var ns = new Tree.SEQ();
                seq.right = ns;
                seq = ns;
            }
        }
        
        return Tree.Ex.fromStm(seq0);
    }
    
    visitIdentifierListNode(node : AST.IdentifierListNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitRangeExpressionNode(node : AST.RangeExpressionNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitFunctionCallNode(node : AST.FunctionCallNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitArrayIndexNode(node : AST.ArrayIndexNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitExpressionListNode(node : AST.ExpressionListNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitIfStatementNode(node : AST.IfStatementNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitReplicationGuideNode(node : AST.ReplicationGuideNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitImperativeBlockNode(node : AST.ImperativeBlockNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    visitArrayNode(node : AST.ArrayNode) : Tree.Ex {
        throw new Error("Not implemented");
    }
    
    visitForLoopNode(node: AST.ForLoopNode){ throw new Error("Not implemented"); }
    visitWhileLoopNode(node: AST.WhileLoopNode){ throw new Error("Not implemented"); }
    visitAssignmentStatementNode(node: AST.AssignmentStatementNode){ throw new Error("Not implemented"); }
    visitContinueStatementNode(node: AST.ContinueStatementNode){ throw new Error("Not implemented"); }
    visitBreakStatementNode(node: AST.BreakStatementNode){ throw new Error("Not implemented"); }
}
