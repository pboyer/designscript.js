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
	| es 
	;

es
	: e
	{ $$ = new yy.ExprStmt( $1 ); }
	;

b 	: LBRACE sl RBRACE
	;

rs 	: RETURN e
	{ $$ = new yy.ReturnStmt( $2 ); }
	| RETURN
	{ $$ = new yy.ReturnStmt(); }
	;

fd
	: DEF id LPAREN al RPAREN LBRACE sl RBRACE
	{ $$ = new yy.FuncDefStmt( $2, $4, $7); }
	;

vd	
	: VAR id ASSIGN e
	{ $$ = new yy.AssignStmt( $2, $4 ); }
	;

ifs
	: IF LPAREN e RPAREN b 
	{ $$ = new yy.IfStmt( $3, $5 ); }
	| IF LPAREN e RPAREN b ELSE s
	{ $$ = new yy.IfStmt( $3, $5, $7 ); }
	;

al	: tid COMMA al
	{ $$ = new yy.IdList( $1, $3 ); }
	| tid
	{ $$ = new yy.IdList( $1 ); }
	|
	;

id
	: ID
	{ $$ = new yy.Id($1); }
	;

tid
	: id
	| id COLON t
	{ $$ = new yy.Id( $1, $3 ); }
	;


el 
	: e COMMA el
	{ $$ = new yy.ExprList($1, $3); }
	| e
	{ $$ = new yy.ExprList($1); }	
	;

e
	: l
	| id
	| e PLUS e 
	{ $$ = new yy.BinOpExpr($2 ,$1, $3); }
	| e MINUS e
	{ $$ = new yy.BinOpExpr($2 ,$1, $3); }
	| e TIMES e
	{ $$ = new yy.BinOpExpr($2, $1, $3); }
	| e EQUALITY e
	{ $$ = new yy.BinOpExpr($2, $1, $3); }
	| e GREATER e
	{ $$ = new yy.BinOpExpr($2, $1, $3); }
	| e OR e
	{ $$ = new yy.BinOpExpr($2, $1, $3); }
	| id LPAREN el RPAREN
	{ $$ = new yy.ApplyExpr($1, $3); }
	| LPAREN e RPAREN
	{ $$ = $2; }
	;

l 	
	: LITERAL
	{ $$ = new yy.IntLit( $1 ); }	
	;

