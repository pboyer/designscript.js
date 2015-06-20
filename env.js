(function(exports){
	
	//
	// Environment
	//
	function Env( outer ){
		this.dict = {};
		this.outer = outer; 
	}

	exports.Env = Env;

	Env.prototype.lookup = function(id){
		if (this.dict[id] != undefined) return this.dict[id];
		if (this.outer != undefined) return this.outer.lookup(id);
		throw new Error("Unbound identifier!");
	}
	
	Env.prototype.set = function(id, val){
		this.dict[id] = val;
	}

})(exports);
