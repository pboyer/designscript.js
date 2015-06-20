(function(interp){
	
	//
	// Environment
	//
	function Env( outer ){
		this.dict = {};
		this.outer = outer; 
	}

	Env.prototype.lookup = function(id){
		if (this.dict[id] != undefined) return this.dict[id];
		if (this.outer != undefined) return this.outer.lookup(id);
		throw new Error("Unbound identifier!");
	}
	
	Env.prototype.set = function(id, val){
		this.dict[id] = val;
	}

})(exports);
