import * as AST from '../AST';
import { Label, Temp } from "./Frame";
import { Visitor } from "../Visitor";
import * as Tree from "./Tree";

export class IR implements Visitor<Tree.UnionExp> {
    
    visitIdentifierNode(node : AST.IdentifierNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    
    visitIdentifierListNode(node : AST.IdentifierListNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    
    visitNumberNode(node : AST.NumberNode) : Tree.UnionExp {
        return new Tree.Ex( new Tree.CONST(node.value) );
    }
    
    visitBooleanNode(node : AST.BooleanNode) : Tree.UnionExp {
        return new Tree.Ex( new Tree.CONST(node.value) );
    }
    
    visitStringNode(node : AST.StringNode) : Tree.UnionExp {
        return new Tree.Ex( new Tree.CONST(node.value) );
    }
    
    visitArrayNode(node : AST.ArrayNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitBinaryExpressionNode(node : AST.BinaryExpressionNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitRangeExpressionNode(node : AST.RangeExpressionNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitFunctionCallNode(node : AST.FunctionCallNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitArrayIndexNode(node : AST.ArrayIndexNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitExpressionListNode(node : AST.ExpressionListNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitStatementListNode(node : AST.StatementListNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitIfStatementNode(node : AST.IfStatementNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitAssignmentNode(node : AST.AssignmentNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitReplicationGuideNode(node : AST.ReplicationGuideNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitImperativeBlockNode(node : AST.ImperativeBlockNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode) : Tree.UnionExp {
        throw new Error("Not implemeted");
    }
}
