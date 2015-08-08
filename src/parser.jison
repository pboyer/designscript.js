%{
    function recordState( node, state ){
		node.location = {
	        firstLine : state.first_line,
		    lastLine : state.last_line,
		    firstCol : state.first_column,
		    lastCol : state.last_column
		}

        return node;
    }
%}

%right ASSIGN
%left OR
%nonassoc EQUALITY RCARET
%left PLUS MINUS
%left TIMES
%right NOT
%left DOT
%nonassoc LCARET

%%

Program
	: StatementList ENDOFFILE
	{ return $1; }
	;

StatementList
	: Statement StatementList
	{ $$ = recordState( new yy.StatementListNode( $1, $2 ), @$); }
	|
	{ $$ = recordState( new yy.StatementListNode(), @$); }
    ;

Statement 
	: FunctionDefinition 
	| Block
	| Assignment
	| FunctionCall SEMICOLON
    | IfStatement
	| ReturnStatement
    | LanguageBlock
    ;

LanguageBlock 	
    : LBRACKET ASSOCIATIVE RBRACKET Block
	{ $$ = recordState( new yy.AssociativeBlockNode( $4 ), @$);  }
    | LBRACKET IMPERATIVE RBRACKET Block
	{ $$ = recordState( new yy.ImperativeBlockNode( $4 ), @$);  }
    ;

Block 	
    : LBRACE StatementList RBRACE
	{ $$ = $2; }
    ;

ReturnStatement
    : RETURN ASSIGN Expression SEMICOLON
	{ $$ = recordState( new yy.ReturnNode( $3 ), @$); }
	;

FunctionDefinition
	: DEF Identifier LPAREN IdentifierList RPAREN LBRACE StatementList RBRACE
	{ $$ = recordState( new yy.FunctionDefinitionNode( $2, $4, $7), @$); }
	;

Assignment	
	: TypedIdentifier ASSIGN Expression SEMICOLON
	{ $$ = recordState( new yy.AssignmentNode( $1, $3 ), @$); }
    ;

IfStatement
	: IF LPAREN Expression RPAREN Block
	{ $$ = recordState( new yy.IfStatementNode( $3, $5 ), @$); }
	| IF LPAREN Expression RPAREN Block ELSE Statement
	{ $$ = recordState( new yy.IfStatementNode( $3, $5, $7 ), @$); }
	;

IdentifierList
    : TypedIdentifier COMMA IdentifierList
	{ $$ = recordState( new yy.IdentifierListNode( $1, $3 ), @$); }
	| TypedIdentifier
	{ $$ = recordState( new yy.IdentifierListNode( $1 ), @$); }
	|
	;

Identifier
	: ID
	{ $$ = recordState( new yy.IdentifierNode($1), @$); }
	;

TypedIdentifier
	: Identifier
	| ID COLON Type
	{ $$ = recordState( new yy.IdentifierNode( $1, $3 ), @$); }
	;

Type
	: ID
	{ $$ = recordState( new yy.Type( $1 ), @$); }
	;

ExpressionList 
	: Expression COMMA ExpressionList
	{ $$ = recordState( new yy.ExpressionListNode($1, $3), @$); }
	| Expression
	{ $$ = recordState( new yy.ExpressionListNode($1), @$); }	
	|
    ;

Expression
	: Literal
	| Identifier
    | FunctionCall
    | BinaryExpression
    | Identifier ReplicationGuideList
	{ $$ = recordState( new yy.ReplicationExpressionNode($1, $2), @$); }
	| LPAREN Expression RPAREN
	{ $$ = $2; }
	| Identifier LBRACKET Expression RBRACKET
	{ $$ = recordState( new yy.ArrayIndexNode( $1, $3 ), @$); }	
	;

BinaryExpression
	: Expression PLUS Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2 ,$1, $3), @$); }
	| Expression MINUS Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2 ,$1, $3), @$); }
	| Expression TIMES Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| Expression EQUALITY Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| Expression RCARET Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| Expression OR Expression
	{ $$ = recordState( new yy.BinaryExpressionNode($2, $1, $3), @$); }
    ;

ReplicationGuide
    : LCARET Expression RCARET
	{ $$ = recordState( new yy.ReplicationGuideNode( $2 ), @$); }
    ;

ReplicationGuideList
    : ReplicationGuide
	{ $$ = recordState( new yy.ReplicationGuideListNode( $1 ), @$); }
    | ReplicationGuide ReplicationGuideList
	{ $$ = recordState( new yy.ReplicationGuideListNode( $1, $2 ), @$); }
    ;

FunctionCall
    : Identifier LPAREN ExpressionList RPAREN
	{ $$ = recordState( new yy.FunctionCallNode($1, $3), @$); }
    ;

Literal	
	: NUMBER
	{ $$ = recordState( new yy.NumberNode( $1 ), @$); }
	| TRUE
	{ $$ = recordState( new yy.BooleanNode( $1 ), @$); }
	| FALSE
	{ $$ = recordState( new yy.BooleanNode( $1 ), @$); }
	| STRING
	{ $$ = recordState( new yy.StringNode( $1 ), @$); }
	| LBRACE ExpressionList RBRACE
	{ $$ = recordState( new yy.ArrayNode( $2 ), @$); }
	;
	