all : build

build:
	tsc
	jison src/parser.jison src/lexer.jisonlex -o src/parser.js

test: build
	node src/interpreter_test.js 
	node src/parser_test.js

clean:
	rm src/ast.js src/parser.js src/interpreter.js src/environment.js src/visitor.js
