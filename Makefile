all : build

build:
	tsc 
	jison src/parser.jison src/lexer.jisonlex -o src/parser.js

release: build
	mkdir -p build
	browserify src/ds.js -o build/ds.js -s ds

test: build
	node src/parser_test.js
	node src/interpreter_test.js 

clean:
	rm -rf build
	rm src/ast.js src/parser.js src/interpreter.js src/environment.js src/visitor.js
