import * as AST from './AST';

export interface Visitor<T> {

    visitIdentifierNode(node : AST.IdentifierNode) : T;
    visitIdentifierListNode(node : AST.IdentifierListNode) : T;
    visitNumberNode(node : AST.NumberNode) : T;
    visitBooleanNode(node : AST.BooleanNode) : T;
    visitStringNode(node : AST.StringNode) : T;
    visitArrayNode(node : AST.ArrayNode) : T;
    visitBinaryExpressionNode(node : AST.BinaryExpressionNode) : T;
    visitRangeExpressionNode(node : AST.RangeExpressionNode) : T;
    visitFunctionCallNode(node : AST.FunctionCallNode) : T;
    visitArrayIndexNode(node : AST.ArrayIndexNode) : T;
    visitExpressionListNode(node : AST.ExpressionListNode) : T;
    visitStatementListNode(node : AST.StatementListNode) : T;
    visitIfStatementNode(node : AST.IfStatementNode) : T;
    visitFunctionDefinitionNode(node : AST.FunctionDefinitionNode) : T;
    visitAssignmentNode(node : AST.AssignmentNode) : T;
    visitReplicationExpressionNode(node : AST.ReplicationExpressionNode) : T;
    visitReplicationGuideNode(node : AST.ReplicationGuideNode) : T;
    visitReplicationGuideListNode(node : AST.ReplicationGuideListNode) : T;
    visitImperativeBlockNode(node : AST.ImperativeBlockNode) : T;
    visitAssociativeBlockNode(node : AST.AssociativeBlockNode) : T;
    
    visitForLoopNode(node: AST.ForLoopNode);
    visitWhileLoopNode(node: AST.WhileLoopNode);
    visitAssignmentStatementNode(node: AST.AssignmentStatementNode);
    visitContinueStatementNode(node: AST.ContinueStatementNode);
    visitBreakStatementNode(node: AST.BreakStatementNode);
    
}

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
    visitReplicationExpressionNode(node: AST.ReplicationExpressionNode, ret: (T) => void);
    visitReplicationGuideNode(node: AST.ReplicationGuideNode, ret: (T) => void);
    visitReplicationGuideListNode(node: AST.ReplicationGuideListNode, ret: (T) => void);
    visitImperativeBlockNode(node: AST.ImperativeBlockNode, ret: (T) => void);
    visitAssociativeBlockNode(node: AST.AssociativeBlockNode, ret: (T) => void);
    visitAssignmentStatementNode(node: AST.AssignmentStatementNode, ret: (T) => void);
    visitAssignmentNode(node: AST.AssignmentNode, ret: (T) => void);
    
    visitForLoopNode(node: AST.ForLoopNode, ret: (T) => void);
    visitWhileLoopNode(node: AST.WhileLoopNode, ret: (T) => void);
    visitContinueStatementNode(node: AST.ContinueStatementNode, ret: (T) => void);
    visitBreakStatementNode(node: AST.BreakStatementNode, ret: (T) => void);
    
}