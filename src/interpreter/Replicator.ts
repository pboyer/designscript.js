import { TypedFunction, ReplicatedExpression } from "./RuntimeTypes";

export class Replicator {
       
    static cpsreplicate(fd: TypedFunction, args: any[], ret : (any) => any, repGuides? : number[] ) {

        if (!repGuides){
            repGuides = new Array<number>(args.length);
        
            for (var i = 0; i < args.length; i++){
                var arg = args[i];
                if (arg instanceof ReplicatedExpression){
                    args[i] = arg.value;
                    repGuides[i] = arg.replicationGuides[0];
                } else {
                    repGuides[i] = 1;
                }
            }
        }
        
        var expectedTypes : string[] = fd.argumentTypes.map((x) => x.typeName);
        
        if ( Replicator.allTypesMatch(args, expectedTypes)){
            args.push(ret);
            return fd.func.apply(undefined, args);
        } 
        
        
        var sortedRepGuides = repGuides ? Replicator.sortRepGroups(repGuides, args.length) : [Replicator.range(args.length)];
        
        Replicator.cpsreplicateCore( fd, args, expectedTypes, sortedRepGuides, 0, ret );
    }
    
    private static cpsreplicateCore(fd : TypedFunction, args : any[], expectedTypes : string[], 
        sortedRepGuides : number[][], curRepGuide : number, ret : (any) => any ){
        
        var isTypeMatch = Replicator.allTypesMatch(args, expectedTypes);
        
        // are we at the the last replication guide and matching
        if ( curRepGuide > sortedRepGuides.length-1){
            if (isTypeMatch) {
                args.push(ret);
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure: " + "Expected " + expectedTypes + ", but got " + args );
        } 
       
        var s = sortedRepGuides[curRepGuide];
        
        var minLen = s.reduce((a, x) => (args[x] instanceof Array) ? 
            Math.min(args[x].length, a) : a, Number.MAX_VALUE);
        
        var iter = (i, r) => {
            if (i >= minLen){
                return ret(r);
            }
            
            // build up all args to be replicated
            var curargs = [];
            for (var j = 0, l = args.length; j < l; j++){
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
                
            Replicator.cpsreplicateCore( fd, curargs, expectedTypes, sortedRepGuides, curRepGuide + 1, (v) => {
                r.push(v);
                iter( i + 1, r );
            });
        }

        iter( 0, [] );
    }
     
    static replicate(fd: TypedFunction, args: any[], repGuides? : number[]): any {

        if (!repGuides){
            repGuides = new Array<number>(args.length);
        
            for (var i = 0; i < args.length; i++){
                var arg = args[i];
                if (arg instanceof ReplicatedExpression){
                    args[i] = arg.value;
                    repGuides[i] = arg.replicationGuides[0];
                } else {
                    repGuides[i] = 1;
                }
            }
        }
        
        var expectedTypes : string[] = fd.argumentTypes.map((x) => x.typeName);
        
        if ( Replicator.allTypesMatch(args, expectedTypes)){
            return fd.func.apply(undefined, args);
        } 
        
        var sortedRepGuides = repGuides ? Replicator.sortRepGroups(repGuides, args.length) : [Replicator.range(args.length)];
        
        return Replicator.replicateCore( fd, args, expectedTypes, sortedRepGuides, 0 );
    }
    
    private static replicateCore(fd : TypedFunction, args : any[], expectedTypes : string[], sortedRepGuides : number[][], curRepGuide : number){
        
        var isTypeMatch = Replicator.allTypesMatch(args, expectedTypes);
        
        // are we at the the last replication guide and matching
        if ( curRepGuide > sortedRepGuides.length-1){
            if (isTypeMatch) {
                return fd.func.apply(undefined, args);
            }
            throw new Error("Type match failure: " + "Expected " + expectedTypes + args );
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
            results.push( Replicator.replicateCore( fd, curargs, expectedTypes, sortedRepGuides, curRepGuide + 1 ) );
        }
     
        return results;
    }
    
    private static range(t : number) : any[] {
         var a = [];
         for (var i = 0; i < t; i++) a.push(i);
         return a;
    }
    
    private static repeat(t : number, v : any) : any[] {
         var a = [];
         for (var i = 0; i < t; i++) a.push(v);
         return a;
    }
    
    private static sortRepGroups(repGuides : number[], argCount : number) : number[][] {

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
       
    static allTypesMatch( args: any[], expectedTypes : string[] ){
    
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
        	if ( !Replicator.isTypeMatch(args[i], expectedTypes[i]) ){
        		return false;
        	}
        }
        
        return true;
    }
       
    static isTypeMatch(arg : any, typeName : string = "var") {

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