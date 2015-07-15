//
// Environment
//

export class Environment {
    outer : Environment;
    dict : { [ id : string ] : any; } = {};

    constructor ( outer : Environment = null){
        this.outer = outer; 
    }

    lookup(id : string) : any {
        if (this.dict[id] != undefined) return this.dict[id];
        if (this.outer != undefined) return this.outer.lookup(id);
        throw new Error(id + " is an unbound identifier!");
    }

    set(id : string, val : any) : void {
        this.dict[id] = val;
    }
}
