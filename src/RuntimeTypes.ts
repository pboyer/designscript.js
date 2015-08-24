import { ParserState } from "./AST";

export class TypedFunction {
    name: string;
    func: (...any) => any;
    argumentTypes: TypedArgument[];

    constructor(f: (...any) => any, al: TypedArgument[], name: string ) {
        this.func = f;
        this.argumentTypes = al; 
        this.name = name;
    }
    
    static byFunction(f: (...any) => any, al: TypedArgument[], name: string){
        return new TypedFunction(function() {
            // we obtain the arguments
            var args = Array.prototype.slice.call(arguments);
            
            // get the callback
            var c = args.pop();
            
            // call the synchronous function
            c(f.apply(undefined, args));
        }, al, name);
    }
}

export class TypedArgument {
    name: string;
    typeName: string;

    constructor(name: string, typeName : string = 'var') {
        this.name = name;
        this.typeName = typeName;
    }
}

export class ReplicatedExpression {
    value: any;
    replicationGuides: number[];

    constructor(v: any, rgl: number[]) {
        this.value = v;
        this.replicationGuides = rgl;
    }
}

export class DesignScriptError {
	state : ParserState;
	message: string;
	stack: string;
	
	constructor(message : string, state : ParserState ){
		this.message = message;
        this.state = state;
	}
	
	toString(){
		return "Error: " + this.message;
	}	
}