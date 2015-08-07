id                          [a-zA-Z][a-zA-Z0-9\.]*(\[\])*
str                         [a-zA-Z0-9\s]*
number                      [-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?

%%
"//".*                      /* ignore comment */
"if"                        return 'IF';
"else"                      return 'ELSE';
"def"			            return 'DEF';
"var"			            return 'VAR';
"var[]..[]"			        return 'VARRANGE';
"null"                      return 'NUL';
"true"                      return 'TRUE';
"false"                     return 'FALSE';
"Imperative"                return 'IMPERATIVE';
"Associative"               return 'ASSOCIATIVE';
"return"                    return 'RETURN';
{number}                    return 'NUMBER';
{id}                        return 'ID';
"\""{str}"\""               return 'STRING';
"=="                        return 'EQUALITY';
"="                         return 'ASSIGN';
"+"                         return 'PLUS';
"-"                         return 'MINUS';
"*"                         return 'TIMES';
":"                         return 'COLON';
","                         return 'COMMA';
"<"                         return 'LCARET';
">"                         return 'RCARET';
"||"                        return 'OR';
"!"                         return 'NOT';
"."                         return 'DOT';
"{"                         return 'LBRACE';
"}"                         return 'RBRACE';
"("                         return 'LPAREN';
")"                         return 'RPAREN';
"["                         return 'LBRACKET';
"]"                         return 'RBRACKET';
";"                         return 'SEMICOLON';
\s+                         /* skip whitespace */
"."                         throw 'Illegal character';
<<EOF>>                     return 'ENDOFFILE';


