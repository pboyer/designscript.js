import ast = require('./ast');

export interface Visitor<T> {

    visitIdentifierNode(node : ast.IdentifierNode) : T;
    visitIdentifierListNode(node : ast.IdentifierListNode) : T;
    visitNumberNode(node : ast.NumberNode) : T;
    visitBooleanNode(node : ast.BooleanNode) : T;
    visitStringNode(node : ast.StringNode) : T;
    visitArrayNode(node : ast.ArrayNode) : T;
    visitBinaryExpressionNode(node : ast.BinaryExpressionNode) : T;
    visitFunctionCallNode(node : ast.FunctionCallNode) : T;
    visitArrayIndexNode(node : ast.ArrayIndexNode) : T;
    visitExpressionListNode(node : ast.ExpressionListNode) : T;
    visitStatementListNode(node : ast.StatementListNode) : T;
    visitIfStatementNode(node : ast.IfStatementNode) : T;
    visitFunctionDefinitionNode(node : ast.FunctionDefinitionNode) : T;
    visitAssignmentNode(node : ast.AssignmentNode) : T;
    visitReturnNode(node : ast.ReturnNode) : T;
    visitReplicationExpressionNode(node : ast.ReplicationExpressionNode) : T;
    visitReplicationGuideNode(node : ast.ReplicationGuideNode) : T;
    visitReplicationGuideListNode(node : ast.ReplicationGuideListNode) : T;
    visitImperativeBlockNode(node : ast.ImperativeBlockNode) : T;
    visitAssociativeBlockNode(node : ast.AssociativeBlockNode) : T;
    
}
