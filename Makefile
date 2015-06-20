all:
	jison parse.jison lex.jisonlex

test: 
	node parse_test.js
	node interp_test.js
