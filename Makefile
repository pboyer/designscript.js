all : build

build:
	tsc
	jison parse.jison lex.jisonlex

test: build
	node ./interp_test.js 
	node ./parse_test.js

clean:
	rm ast.js parse.js interp.js env.js
