import { ParserState } from "./ast";

declare class Error {
	name:string;
    message:string;
	constructor(message?: string);
	stack : string;
}

export class RuntimeError extends Error {
	state : ParserState;
	
	constructor(message : string, state : ParserState ){
		super(message);
		this.state = state;
	}
	
	toString(){
		return "RuntimeError";
	}	
}