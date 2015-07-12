all : build

build:
	tsc
	jison parser.jison lexer.jisonlex

test: build
	node ./interpreter_test.js 
	node ./parser_test.js

clean:
	rm ast.js parser.js interpreter.js environment.js visitor.js
