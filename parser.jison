%{
    function record( node, state ){
        node.firstLine = state.first_line;
        node.lastLine = state.last_line;
        node.firstCol = state.first_column;
        node.lastCol = state.last_column;
        return node;
    }
%}

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
	{ $$ = record( new yy.StmtList( $1, $3 ), @$); }
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
	{ $$ = $2; }
    ;

rs 	: RETURN ASSIGN e
	{ $$ = record( new yy.ReturnNode( $3 ), @$); }
	;

fd
	: DEF id LPAREN al RPAREN LBRACE sl RBRACE
	{ $$ = record( new yy.FunctionDefinitionNode( $2, $4, $7), @$); }
	;

vd	
	: tid ASSIGN e
	{ $$ = record( new yy.AssignmentNode( $1, $3 ), @$); }
    ;
ifs
	: IF LPAREN e RPAREN b 
	{ $$ = record( new yy.IfStatementNode( $3, $5 ), @$); }
	| IF LPAREN e RPAREN b ELSE s
	{ $$ = record( new yy.IfStatementNode( $3, $5, $7 ), @$); }
	;

al	: tid COMMA al
	{ $$ = record( new yy.IdentifierListNode( $1, $3 ), @$); }
	| tid
	{ $$ = record( new yy.IdentifierListNode( $1 ), @$); }
	|
	;

id
	: ID
	{ $$ = record( new yy.IdentifierNode($1), @$); }
	;

tid
	: id
	| ID COLON t
	{ $$ = record( new yy.TypedIdentifierNode( $1, $3 ), @$); }
	;

t
	: ID
	{ $$ = record( new yy.Type( $1 ), @$); }
	| ID LBRACKET RBRACKET
	{ $$ = record( new yy.Type( $1 ), @$); }
	;

el 
	: e COMMA el
	{ $$ = record( new yy.ExprListNode($1, $3), @$); }
	| e
	{ $$ = record( new yy.ExprListNode($1), @$); }	
	;

fal 
	: fa COMMA fal
	{ $$ = record( new yy.FuncArgExprList($1, $3), @$); }
	| fa
	{ $$ = record( new yy.FuncArgExprList($1), @$); }	
	;

fa
	: e LCARET INT RCARET
	{ $$ = record( new yy.FuncArgExpr( $1, parseInt( $3 ) ), @$); }
	| e 
	{ $$ = record( new yy.FuncArgExpr( $1 ), @$); }
	;

e
	: l
	| id
	| e PLUS e 
	{ $$ = record( new yy.BinaryExpressionNode($2 ,$1, $3), @$); }
	| e MINUS e
	{ $$ = record( new yy.BinaryExpressionNode($2 ,$1, $3), @$); }
	| e TIMES e
	{ $$ = record( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| e EQUALITY e
	{ $$ = record( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| e GREATER e
	{ $$ = record( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| e OR e
	{ $$ = record( new yy.BinaryExpressionNode($2, $1, $3), @$); }
	| id LPAREN fal RPAREN
	{ $$ = record( new yy.FunctionCallNode($1, $3), @$); }
	| LPAREN e RPAREN
	{ $$ = record( $2, @$); }
	| id LBRACKET e RBRACKET
	{ $$ = record( new yy.ArrayIndexNode( $1, $3 ), @$); }	
	;

l 	
	: INT
	{ $$ = record( new yy.IntNode( $1 ), @$); }
	| TRUE
	{ $$ = record( new yy.BooleanNode( $1 ), @$); }
	| FALSE
	{ $$ = record( new yy.BooleanNode( $1 ), @$); }
	| STRING
	{ $$ = record( new yy.StringNode( $1 ), @$); }
	| LBRACE el RBRACE
	{ $$ = record( new yy.ArrayNode( $2 ), @$); }
	;

