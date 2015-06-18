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
    ;

s : fd 
  | e 
  ;

sl
    : s SEMICOLON sl
    | s SEMICOLON
    ;

fd
    : t id LPAREN t id RPAREN LBRACE vdl el RBRACE fd
    ;

id
    : ID
    ;

e
    : LITERAL
    | id
    | e PLUS e
    | e MINUS e
    | e TIMES e
    | e EQUALITY e
    | e GREATER e
    | NOT e
    | e OR e
    | e DOT id
    | id ASSIGN e
    | id LPAREN e RPAREN
    | LPAREN e RPAREN
    ;

