digit                       [0-9]
id                          [a-zA-Z][a-zA-Z0-9]*
str                         [a-zA-Z0-9\s]*

%%
"//".*                      /* ignore comment */
"if"                        return 'IF';
"else"                      return 'ELSE';
"def"			            return 'DEF';
"var"			            return 'VAR';
"null"                      return 'NUL';
"true"                      return 'TRUE';
"false"                     return 'FALSE';
"return"                    return 'RETURN';
{digit}+                    return 'INT';
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


