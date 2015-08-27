// hashed string for fast lookup
class Symbol {
	name : string;
}

// abstract name for an address that will 
// definitely be known at runtime
class Label {
	private static _count = 0;
	name : string;
	count : number;
	
	// called when identifying a function or other 
	// location in the code
	constructor(s? : Symbol | string){
		this.count = Label._count++;
		if (!s){
			if (s instanceof Symbol){
				this.name = s.name;
			} else if (s instanceof String){
				this.name = s;
			}
		} else {
			this.name = "L" + this.count;
		}
	}
	
	toString = () => name;
}

// abstract name for a local variable
class Temp {
	private static _count : number;
	count : number;
	
	// new temp from infinite collection
	constructor(){
		this.count = Temp._count++;
	}
	
	toString = () => "t" + name;
}

interface Access {
	
}

// variable stored in register
class RegAccess implements Access {
	temp : Temp;
}

// variable stored in a frame
class FrameAccess implements Access {
	offset : number;
}

interface Frame {
	// new frame with code at label and a list of whether the
	// parameter escapes or not
	newFrame( label : Label, formals : Boolean[] ) : Frame;
	// where does the function's machine code begin?
	name : Label;
	// where will the arguments be stored?
	formals : Access[];
	// called during the translation phase to allocate space for a local
	// the argument describes whether the variable escapes (i.e. in a 
	// nested function or when taking the address)
	allocLocal(escape : boolean) : Access;
}

