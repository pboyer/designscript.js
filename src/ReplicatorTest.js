var Replicator = require('./Replicator').Replicator
	, types = require('./Types')
	, assert = require('assert');

function run(f, a, rg){
	return Replicator.replicate(f,a,rg);
}

var doubleIt = 
	new types.TypedFunction(
		function(a){ return 2 * a; }, 
		[new types.TypedArgument("a", "number")] );
assert.deepEqual( 4, run(doubleIt, [ 2 ]));	
assert.throws( function(){ run(doubleIt, [ true ]) });	
assert.deepEqual( [4,8], run(doubleIt, [[2, 4]]));	

var addArr = 
	new types.TypedFunction(
		function(a){ return a[0] + a[1]; }, 
		[new types.TypedArgument("a", "number[]")] );
assert.deepEqual( 6, run(addArr, [[2, 4]]));	

var addBoth = 
	new types.TypedFunction(
		function(a,b){ return [a[0]+b, a[1]+b]; }, 
		[ 	new types.TypedArgument("a", "number[]"), 
			new types.TypedArgument("b", "number")]);
assert.deepEqual( [4,6], run(addBoth, [[2, 4], 2]));	

var mixedTypes = 
	new types.TypedFunction(
		function(a,b){ return b ? a : -1; }, 
		[	new types.TypedArgument("a", "number"), 
			new types.TypedArgument("b", "boolean")]);
assert.deepEqual( 12, run(mixedTypes, [12, true]));	

var add = 
	new types.TypedFunction(
		function(a,b){ return a + b; }, 
		[	new types.TypedArgument("a", "number"), 
			new types.TypedArgument("b", "number")]);
assert.deepEqual( [4,6], run(add, [[1,2], [3,4]]));
assert.deepEqual( [4,5], run(add, [1, [3,4]]));		
assert.deepEqual( [4], run(add, [[1], [3,4]]));		

var concat = 
	new types.TypedFunction(
		function(a,b){ return a.concat(b); }, 
		[	new types.TypedArgument("a", "var[]..[]"), 
			new types.TypedArgument("b", "var[]..[]")]);
assert.deepEqual( [1,2,3,4], run(concat, [[1,2], [3,4]]));	

assert.deepEqual( [[4,5],[5,6]], run(add, [[1,2], [3,4]], [1,2]));	