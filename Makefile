all : build

build:
	tsc 
	jison src/parser.jison src/lexer.jisonlex -o src/parser.js

release: build
	mkdir -p build
	browserify src/ds.js -o build/ds.js -s ds

test: build
	node src/parser_test.js
	node src/imperative_test.js 
	node src/associative_test.js 

clean:
	rm -rf build
	rm src/ast.js src/types.js src/parser.js src/interpreter.js src/associative.js src/imperative.js src/replicator.js  src/environment.js src/visitor.js
