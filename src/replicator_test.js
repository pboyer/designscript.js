var replicator = require('./replicator')
	, types = require('./types')
	, assert = require('assert');

function run(f, a){
	var r = new replicator.Replicator();
	return r.replicate(f,a);
}

var doubleIt = new types.TypedFunction(function(a){ return 2 * a; }, [new types.TypedArgument("a", "number")], "doubleIt" );
var addArr = new types.TypedFunction(function(a){ return a[0] + a[1]; }, [new types.TypedArgument("a", "number[]")], "addArr" );

assert.deepEqual( 4, run(doubleIt, [ 2 ]));	
assert.throws( function(){ run(doubleIt, [ true ]) });	
assert.deepEqual( [4,8], run(doubleIt, [[2, 4]]));	
assert.deepEqual( 6, run(addArr, [[2, 4]]));	

var addBoth = 
	new types.TypedFunction(
		function(a,b){ return [a[0]+b, a[1]+b]; }, 
		[new types.TypedArgument("a", "number[]"), new types.TypedArgument("b", "number")], 
		"addBoth" );
assert.deepEqual( [4,6], run(addBoth, [[2, 4], 2]));	


