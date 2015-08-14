import types = require('./types');

export class Replicator {
        
    replicate(fd: types.TypedFunction, args: any[], repGuides? : number[]): any {

        if (!repGuides){
            repGuides = new Array<number>(args.length);
        
            for (var i = 0; i < args.length; i++){
                var arg = args[i];
                if (arg instanceof types.ReplicatedExpression){
                    args[i] = arg.value;
                    repGuides[i] = arg.replicationGuides[0];
                } else {
                    repGuides[i] = 1;
                }
            }
        }
        
        var expectedTypes : string[] = fd.argumentTypes.map((x) => x.typeName);
        
        if ( this.allTypesMatch(args, expectedTypes)){
            return fd.func.apply(undefined, args);
        } 
        
        var sortedRepGuides = repGuides ? this.sortRepGroups(repGuides, args.length) : [this.range(args.length)];
        
        return this.replicateCore( fd, args, expectedTypes, sortedRepGuides, 0 );
    }
    
    private replicateCore(fd : types.TypedFunction, args : any[], expectedTypes : string[], sortedRepGuides : number[][], curRepGuide : number){
        
        var isTypeMatch = this.allTypesMatch(args, expectedTypes);
        
        // are we at the the last replication guide and matching
        if ( curRepGuide > sortedRepGuides.length-1){
            if (isTypeMatch) {
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure!");
        } 
        
        var results = [];
        
        var s = sortedRepGuides[curRepGuide];
        
        var minLen = s.reduce((a, x) => (args[x] instanceof Array) ? Math.min(args[x].length, a) : a, Number.MAX_VALUE);
        var i, j, l2;
        
        for (i = 0; i < minLen; i++){
            var curargs = [];
            for (j = 0, l2 = args.length; j < l2; j++){
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
            results.push( this.replicateCore( fd, curargs, expectedTypes, sortedRepGuides, curRepGuide + 1 ) );
        }
     
        return results;
    }
    
    private range(t : number) : any[] {
         var a = [];
         for (var i = 0; i < t; i++) a.push(i);
         return a;
    }
    
    private repeat(t : number, v : any) : any[] {
         var a = [];
         for (var i = 0; i < t; i++) a.push(v);
         return a;
    }
    
    private sortRepGroups(repGuides : number[], argCount : number) : number[][] {
        
        var m = Math.max.apply(undefined, repGuides);
        
        if (m > argCount) {
            throw new Error("Replication guide cannot be larger than the number of arguments!");
        }
        
        var i, sorted = [];
        for (i = 0; i < m; i++)
            sorted.push([]);

        for (i = 0; i < repGuides.length; i++ ){
            if (repGuides[i]-1 < 0) throw new Error("Replication guide must be greater than 0");
            sorted[repGuides[i]-1].push(i);
        }
        
        for (i = 0; i < sorted.length; i++){
            if (sorted[i].length === 0) throw new Error("Invalid replication guides");
        }
        
        return sorted;
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