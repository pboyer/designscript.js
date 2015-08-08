import ast = require('./ast');

export interface Interpreter {
	run(statements: ast.StatementListNode) : any;
    set( id : string, n : any );
    lookup( id : string ) : any;
}