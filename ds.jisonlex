digit                       [0-9]
id                          [a-zA-Z][a-zA-Z0-9]*

%%
"//".*                      /* ignore comment */
"null"                      return 'NUL';
{digit}+                    return 'LITERAL';
{id}                        return 'ID';
"=="                        return 'EQUALITY';
"="                         return 'ASSIGN';
"+"                         return 'PLUS';
"-"                         return 'MINUS';
"*"                         return 'TIMES';
">"                         return 'GREATER';
"||"                        return 'OR';
"!"                         return 'NOT';
"."                         return 'DOT';
"{"                         return 'LBRACE';
"}"                         return 'RBRACE';
"("                         return 'LPAREN';
")"                         return 'RPAREN';
";"                         return 'SEMICOLON';
\s+                         /* skip whitespace */
"."                         throw 'Illegal character';
<<EOF>>                     return 'ENDOFFILE';


