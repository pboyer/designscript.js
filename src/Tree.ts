import { Label, Temp } from "./Frame";

interface Exp {
	
}

class CONST implements Exp { 
	constructor(value : any){
		
	}
}

class NAME implements Exp { 
	constructor(label : Label){}
}

class TEMP implements Exp { 
	constructor(temp : Temp){}
}

class BINOP implements Exp { 
	constructor(binop : string, left : Exp, right : Exp){}
}

class MEM implements Exp { 
	constructor(exp : Exp){}
}

class CALL implements Exp {
	constructor(func : Exp, args : Exp[] ){}
}

class ESEQ implements Exp { 
	constructor(stm : Stm, exp : Exp){}
}

interface Stm {
	
}

class MOVE implements Stm { 
	constructor(dst : Exp, src : Exp){}
}

class EXP implements Stm { 
	constructor(exp : Exp){}
}

class JUMP implements Stm { 
	constructor(exp : Exp, targets : Label[]){}
}

class CJUMP implements Stm { 
	constructor(binop : string, left : Exp, right : Exp, trueStm : Stm, falseStm : Stm){}
}

class SEQ implements Stm { 
	constructor(left: Stm, right : Stm){}
}

class LABEL implements Stm { 
	constructor(label : Label){}
}

interface ExpEmitter {
	unEx() : Exp;
	unNx() : Stm;
	unCx(t : Label, f : Label);
}