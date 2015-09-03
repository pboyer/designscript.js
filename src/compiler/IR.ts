import * as AST from '../AST';
import { Label, Temp } from "./Frame";
import { Visitor } from "../Visitor";

export class IR implements Visitor<any> {
    
    visitIdentifierNode(node : AST.IdentifierNode) : any {
        
    }
    
    visitIdentifierListNode(node : AST.IdentifierListNode) : any {
        
    }
    
    visitNumberNode(node : AST.NumberNode) : any {
        
    }
    
    visitBooleanNode(node : AST.BooleanNode) : any {
        
    }
    
    visitStringNode(node : AST.StringNode) : any {
        
    }
    
    visitArrayNode(node : AST.ArrayNode) : any {
        
    }
    visitBinaryExpressionNode(node : AST.BinaryExpressionNode) : any {
        
    }
    visitRangeExpressionNode(node : AST.RangeExpressionNode) : any {
        
    }
    visitFunctionCallNode(node : AST.FunctionCallNode) : any {
        
    }
    visitArrayIndexNode(node : AST.ArrayIndexNode) : any {
        
    }
    visitExpressionListNode(node : AST.ExpressionListNode) : any {
        
    }
    visitStatementListNode(node : AST.StatementListNode) : any {
        
    }
    visitIfStatementNode(node : AST.IfStatementNode) : any {
        
    }
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode) : any {
        
    }
    visitAssignmentNode(node : AST.AssignmentNode) : any {
        
    }
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode) : any {
        
    }
    visitReplicationGuideNode(node : AST.ReplicationGuideNode) : any {
        
    }
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode) : any {
        
    }
    visitImperativeBlockNode(node : AST.ImperativeBlockNode) : any {
        
    }
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode) : any {
        
    }
}
