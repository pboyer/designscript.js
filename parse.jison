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
	| e 
	;

b 	: LBRACE sl RBRACE
	;

rs 	: RETURN e
	{ $$ = new yy.ReturnStmt( $2 ); }
	| RETURN
	{ $$ = new yy.ReturnStmt(); }
	;

fd
	: FUNC id LPAREN al RPAREN LBRACE sl RBRACE
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

al	: id COMMA al
	{ $$ = new yy.IdList( $1, $3 ); }
	| id
	{ $$ = new yy.IdList( $1 ); }
	|
	;

id
	: ID
	;

el 
	: e COMMA el
	{ $$ = new yy.ExpList($1, $3); }
	| e
	{ $$ = new yy.ExpList($1); }	
	;

e
	: l
	| id
	{ $$ = new yy.Id($1); }
	| e PLUS e 
	{ $$ = new yy.BinOpExp($2 ,$1, $3); }
	| e MINUS e
	{ $$ = new yy.BinOpExp($2 ,$1, $3); }
	| e TIMES e
	{ $$ = new yy.BinOpExp($2, $1, $3); }
	| e EQUALITY e
	{ $$ = new yy.BinOpExp($2, $1, $3); }
	| e GREATER e
	{ $$ = new yy.BinOpExp($2, $1, $3); }
	| e OR e
	{ $$ = new yy.BinOpExp($2, $1, $3); }
	| id LPAREN e RPAREN
	{ $$ = new yy.ApplyExp($1, $3); }
	| LPAREN e RPAREN
	{ $$ = $2; }
	;

l 	
	: LITERAL
	{ $$ = new yy.IntLit( $1 ); }	
	;

