TSCOPTIONS=-m commonjs -t ES5
RELEASE_NAME=designscript
RELEASE_OUTPUT=build/designscript.js

all: build release

build: src/AST.js src/ParserTest.js src/compiler/*.js src/interpreter/*.js src/Parser.js

src/AST.js: src/AST.ts
	tsc $(TSCOPTIONS) $^
	
src/ParserTest.js: src/ParserTest.ts
	tsc $(TSCOPTIONS) $^

src/interpreter/%.js: src/interpreter/%.ts
	tsc $(TSCOPTIONS) $^
	
src/compiler/%.js: src/compiler/%.ts
	tsc $(TSCOPTIONS) $^

src/Parser.js: src/Parser.jison src/Lexer.jisonlex
	jison src/Parser.jison src/Lexer.jisonlex -o src/Parser.js

release: build
	mkdir -p build
	browserify release/release.js -o $(RELEASE_OUTPUT) -s $(RELEASE_NAME)

test: build
	node src/ParserTest.js
	node src/interpreter/ReplicatorTest.js 
	node src/interpreter/ImperativeInterpreterTest.js 
	node src/interpreter/AssociativeInterpreterTest.js 
	node src/interpreter/RangeTest.js

clean:
	rm -rf build
	rm -f src/*.js src/*/*.js