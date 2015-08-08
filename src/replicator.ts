import types = require('./types');

export class Replicator {
        
    replicate(fd: types.TypedFunction, args: any[]): any {

        var expectedTypes : string[] = fd.argumentTypes.map((x) => x.typeName);
        
        if (this.allTypesMatch(args, expectedTypes)){
            return fd.func.apply(undefined, args);
        }
        
        // default behavior
        return this.shortest(fd, args);
    }
    
    shortest(fd : types.TypedFunction, args : any[]){
        
        var minLen = args.reduce((a, x) => (x instanceof Array) ? Math.min(x.length, a) : a, Number.MAX_VALUE);
        if (minLen === Number.MAX_VALUE){
            throw new Error("Could not replicate!");
        }
        
        var results = [];
        
        for (var i = 0, l = minLen; i < l; i++){
            var curargs = [];
            for (var j = 0, l2 = args.length; j < l2; j++){
                if (args[j] instanceof Array){
                    if (args[j].length > minLen){
                        curargs.push( args[j][minLen-1] );
                    } else {
                        curargs.push( args[j][i]);
                    }
                } else {
                    curargs.push( args[j] );
                }
            }
            results.push( this.replicate( fd, curargs ) );
        }
        
        return results;
    }
    
    isObjectTypeMatch(arg : any, typeName : string = "var") {

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
        	if ( !this.isObjectTypeMatch(args[i], expectedTypes[i]) ){
        		return false;
        	}
        }
        
        return true;
    }
}