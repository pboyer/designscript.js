all : build

build:
	tsc 
	jison src/Parser.jison src/Lexer.jisonlex -o src/Parser.js

release: build
	mkdir -p build
	browserify src/release.js -o build/ds.js -s ds

test: build
	node src/ParserTest.js
	node src/ReplicatorTest.js 
	node src/ImperativeInterpreterTest.js 
	node src/AssociativeInterpreterTest.js 
	node src/RangeTest.js 

clean:
	rm -rf build
	rm src/AST.js src/RuntimeTypes.js src/Parser.js src/AssociativeInterpreter.js src/ImperativeInterpreter.js src/Replicator.js src/Range.js  src/Environment.js src/Visitor.js
