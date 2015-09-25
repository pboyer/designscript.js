import { Label, Temp } from "./Frame";
import * as AST from '../AST';

export interface Exp {

}

export class CONST implements Exp {
	value: any;
	constructor(value: any) {
		this.value = value;
	}
}

export class NAME implements Exp {
	label: Label;
	constructor(label: Label) {
		this.label = label;
	}
}

export class TEMP implements Exp {
	temp: Temp;
	constructor(temp: Temp) {
		this.temp = temp;
	}
}

export class BINOP implements Exp {
	op: string;
	left: Exp;
	right: Exp;
	constructor(op: string, left: Exp, right: Exp) {
		this.op = op;
		this.left = left;
		this.right = right;
	}
}

export class MEM implements Exp {
	exp: Exp;
	constructor(exp: Exp) {
		this.exp = exp;
	}
}

export class CALL implements Exp {
	func: Exp;
	args: Exp[];
	constructor(func: Exp, args: Exp[]) {
		this.func = func;
		this.args = args;
	}
}

export class ESEQ implements Exp {
	stm: Stm;
	exp: Exp;
	constructor(stm: Stm, exp: Exp) {
		this.stm = stm;
		this.exp = exp;
	}
}

export interface Stm {

}

export class MOVE implements Stm {
	dst: Exp;
	src: Exp;
	constructor(dst: Exp, src: Exp) {
		this.dst = dst;
		this.src = src;
	}
}

export class EXP implements Stm {
	exp: Exp;
	constructor(exp: Exp) {
		this.exp = exp;
	}
}

export class JUMP implements Stm {
	exp: Exp;
	targets: Label[];
	constructor(exp: Exp, targets: Label[]) {
		this.exp = exp;
		this.targets = targets;
	}
}

export class CJUMP implements Stm {
	op: string;
	left: Exp;
	right: Exp;
	trueStm: Stm;
	falseStm: Stm;
	constructor(op: string, left: Exp, right: Exp, trueStm: Stm, falseStm: Stm) {
		this.op = op;
		this.left = left;
		this.right = right;
		this.trueStm = trueStm;
		this.falseStm = falseStm;
	}
}

export class SEQ implements Stm {
	left: Stm;
	right: Stm;
	constructor(left?: Stm, right?: Stm) {
		this.left = left;
		this.right = right;
	}
}

export class LABEL implements Stm {
	label: Label;
	constructor(label: Label) {
		this.label = label;
	}
}

interface TranslateEx {
	unEx(): Exp;
	unNx(): Stm;
	unCx(t: Label, f: Label);
}

export class Ex implements TranslateEx {
	exp: Exp;

	constructor(exp: Exp) {
		this.exp = exp;
	}

	unEx(): Exp {
		return this.exp;
	}

	unNx(): Stm {
		return new EXP(this.exp);
	}

	unCx(t: Label, f: Label) {
		throw new Error("Not implemented");
	}
}

export class Nx implements TranslateEx {
	stm: Stm;

	constructor(stm: Stm) {
		this.stm = stm;
	}

	unEx(): Exp {
		throw new Error("Not implemented");
	}

	unNx(): Stm {
		return this.stm;
	}

	unCx(t: Label, f: Label) : Stm {
		throw new Error("Not implemented");
	}
}

export class AssignmentEx implements TranslateEx {

	constructor( e : AST.AssignmentNode ) {
	}

	unEx(): Exp {
		
		var loc = new MEM()
		// assign it, return rhs
		throw new Error("Not implemented");
	}

	unNx(): Stm {
		// simply assign
		throw new Error("Not implemented");
	}

	unCx(t: Label, f: Label) : Stm {
		// not allowed
		throw new Error("Not implemented");
	}
}

export class Cx implements TranslateEx {
	t: Label;
	f: Label;

	constructor(t: Label, f: Label) {
		this.t = t;
		this.f = f;
	}

	unEx(): Exp {
		throw new Error("Not implemented");
	}

	unNx(): Stm {
		throw new Error("Not implemented");
	}

	unCx(t: Label, f: Label) : Stm {
		throw new Error("Not implemented");
	}
}