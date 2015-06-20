all:
	jison parse.jison lex.jisonlex

test: 
	node test_parse.js
