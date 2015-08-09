var Range = require('./range').Range
	, assert = require('assert');

assert.deepEqual( [0,1], Range.byStartEnd(0,1) );	
assert.deepEqual( [-1,0,1], Range.byStartEnd(-1,1) );	
assert.deepEqual( [0,1,2], Range.byStartEnd(0,2) );	
assert.deepEqual( [2,1,0,-1], Range.byStartEnd(2,-1) );	

assert.deepEqual( [0,0.5,1], Range.byStepSize(0,1,0.5) );	
assert.deepEqual( [1,0.5,0], Range.byStepSize(1,0,-0.5) );	

assert.deepEqual( [0,0.5,1], Range.byStepCount(0,1,3) );	
assert.deepEqual( [1,0.5,0], Range.byStepCount(1,0,3) );	