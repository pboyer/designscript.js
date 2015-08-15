import * as AST from './ast';

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
    
}
