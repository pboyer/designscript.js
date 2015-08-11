import types = require('./types');

export class Replicator {
        
    replicate(fd: types.TypedFunction, args: any[], repGuides? : number[]): any {

        var expectedTypes : string[] = fd.argumentTypes.map((x) => x.typeName);
        
        if ( this.allTypesMatch(args, expectedTypes)){
            return fd.func.apply(undefined, args);
        } 
        
        return this._replicate( fd, args, expectedTypes, [this.range(args.length)], 0 );
    }
    
    _replicate(fd : types.TypedFunction, args : any[], expectedTypes : string[], repGuides : number[][], curRepGuide : number){
        
        var isTypeMatch = this.allTypesMatch(args, expectedTypes);
        
        // are we at the the last replication guide and matching
        if ( curRepGuide > repGuides.length-1 && isTypeMatch){
            if (isTypeMatch) {
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure!");
        } 
        
        var results = [];
        
        var s = repGuides[curRepGuide];
        
        var minLen = s.reduce((a, x) => (args[x] instanceof Array) ? Math.min(args[x].length, a) : a, Number.MAX_VALUE);
        
        for (var i = 0; i < minLen; i++){
            var curargs = [];
            for (var j = 0, l2 = args.length; j < l2; j++){
                if (s.indexOf(j) > -1 && args[j] instanceof Array){
                    if (args[j].length > minLen){
                        curargs.push( args[j][minLen-1] );
                    } else {
                        curargs.push( args[j][i]);
                    }
                } else {
                    curargs.push( args[j] );
                }
            }
            results.push( this._replicate( fd, curargs, expectedTypes, repGuides, curRepGuide + 1 ) );
        }
     
        return results;
    }
    
    private range(t : number) : any[] {
         var a = [];
         for (var i = 0; i < t; i++) a.push(i);
         return a;
    }
       
    allTypesMatch( args: any[], expectedTypes : string[] ){
    
        if ( !expectedTypes || !args ){
        	return true;
        }
        
        // if the Number of args and expected types don't match, return false
        if (args.length != expectedTypes.length){
        	return false;
        }
        
        // for each arg type, check match with expected input types
        for (var i = 0, l = args.length; i < l; i++){
        	// do a fast type match
        	if ( !this.isTypeMatch(args[i], expectedTypes[i]) ){
        		return false;
        	}
        }
        
        return true;
    }
       
    isTypeMatch(arg : any, typeName : string = "var") {

		if ( arg === undefined || arg === null ) return false;

		if ( typeName === "var" && arg.constructor != Array ||      
		     typeName === "var[]..[]" || 
             typeof arg === typeName ) {
                 return true;
        }
         
        // generic arrays like Foo[][]
        while ( arg != undefined && arg != null && typeName.indexOf('[]') != -1 && arg.constructor === Array ){
            arg = arg[0];
            typeName = typeName.slice(0, -2);
       
            if ( typeof arg === typeName ) return true;
        }
        
        return false;
	}

}