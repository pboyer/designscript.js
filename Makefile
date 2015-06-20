all:
	jison parse.jison lex.jisonlex

test: 
	node test.js
