all:
	tsc
	jison parse.jison lex.jisonlex

test:
	node ./interp_test.js 
	node ./parse_test.js
