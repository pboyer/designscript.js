all : build

build:
	tsc 
	jison src/Parser.jison src/Lexer.jisonlex -o src/Parser.js

release: build
	mkdir -p build
	browserify src/release.js -o build/ds.js -s ds

test: build
	node src/ParserTest.js
	node src/interpreter/ReplicatorTest.js 
	node src/interpreter/ImperativeInterpreterTest.js 
	node src/interpreter/AssociativeInterpreterTest.js 
	node src/interpreter/RangeTest.js 

clean:
	rm -rf build
	rm src/AST.js src/Parser.js src/Visitor.js src/interpreter/RuntimeTypes.js 
	rm src/interpreter/AssociativeInterpreter.js src/interpreter/ImperativeInterpreter.js 
	rm src/interpreter/legacy/AssociativeInterpreter.js src/interpreter/legacy/ImperativeInterpreter.js 
	rm src/interpreter/Replicator.js src/interpreter/Range.js  src/interpreter/Environment.js
