%right ASSIGN
%left OR
%nonassoc EQUALITY GREATER
%left PLUS MINUS
%left TIMES
%right NOT
%left DOT

%%

pgm
	: sl ENDOFFILE
	{ return $1; }
	;

sl
	: s SEMICOLON sl
	{ $$ = new yy.StmtList( $1, $3 ); }
	|
	;

s 
	: fd 
	| b
	| vd
	| ifs
	| rs
	;

b 	: LBRACE sl RBRACE
	;

rs 	: RETURN ASSIGN e
	{ $$ = new yy.ReturnNode( $3 ); }
	;

fd
	: DEF id LPAREN al RPAREN LBRACE sl RBRACE
	{ $$ = new yy.FunctionDefinitionNode( $2, $4, $7); }
	;

vd	
	: tid ASSIGN e
	{ $$ = new yy.AssignmentNode( $1, $3 ); }
	;
ifs
	: IF LPAREN e RPAREN b 
	{ $$ = new yy.IfStatementNode( $3, $5 ); }
	| IF LPAREN e RPAREN b ELSE s
	{ $$ = new yy.IfStatementNode( $3, $5, $7 ); }
	;

al	: tid COMMA al
	{ $$ = new yy.IdentifierListNode( $1, $3 ); }
	| tid
	{ $$ = new yy.IdentifierListNode( $1 ); }
	|
	;

id
	: ID
	{ $$ = new yy.IdentifierNode($1); }
	;

tid
	: id
	| ID COLON t
	{ $$ = new yy.TypedIdentifierNode( $1, $3 ); }
	;

t
	: ID
	{ $$ = new yy.Type( $1 ); }
	| ID LBRACKET RBRACKET
	{ $$ = new yy.Type( $1 ); }
	;

el 
	: e COMMA el
	{ $$ = new yy.ExprListNode($1, $3); }
	| e
	{ $$ = new yy.ExprListNode($1); }	
	;

fal 
	: fa COMMA fal
	{ $$ = new yy.FuncArgExprList($1, $3); }
	| fa
	{ $$ = new yy.FuncArgExprList($1); }	
	;

fa
	: e LCARET INT RCARET
	{ $$ = new yy.FuncArgExpr( $1, parseInt( $3 ) ); }
	| e 
	{ $$ = new yy.FuncArgExpr( $1 ); }
	;

e
	: l
	| id
	| e PLUS e 
	{ $$ = new yy.BinaryExpressionNode($2 ,$1, $3); }
	| e MINUS e
	{ $$ = new yy.BinaryExpressionNode($2 ,$1, $3); }
	| e TIMES e
	{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }
	| e EQUALITY e
	{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }
	| e GREATER e
	{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }
	| e OR e
	{ $$ = new yy.BinaryExpressionNode($2, $1, $3); }
	| id LPAREN fal RPAREN
	{ $$ = new yy.FunctionCallNode($1, $3); }
	| LPAREN e RPAREN
	{ $$ = $2; }
	| id LBRACKET e RBRACKET
	{ $$ = new yy.ArrayIndexNode( $1, $3 ); }	
	;

l 	
	: INT
	{ $$ = new yy.IntNode( $1 ); }
	| TRUE
	{ $$ = new yy.BooleanNode( $1 ); }
	| FALSE
	{ $$ = new yy.BooleanNode( $1 ); }
	| STRING
	{ $$ = new yy.StringNode( $1 ); }
	| LBRACE el RBRACE
	{ $$ = new yy.ArrayNode( $2 ); }
	;

