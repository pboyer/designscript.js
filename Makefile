all:
	jison parse.jison lex.jisonlex

test:
	node ./interp_test.js ./parse_test.js
