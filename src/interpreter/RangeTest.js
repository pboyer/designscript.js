/// <reference path="../../typings/node.d.ts" />
var assert = require("assert");
var Range_1 = require('./Range');
assert.deepEqual([0, 1], Range_1.Range.byStartEnd(0, 1));
assert.deepEqual([-1, 0, 1], Range_1.Range.byStartEnd(-1, 1));
assert.deepEqual([0, 1, 2], Range_1.Range.byStartEnd(0, 2));
assert.deepEqual([2, 1, 0, -1], Range_1.Range.byStartEnd(2, -1));
assert.deepEqual([0, 0.5, 1], Range_1.Range.byStepSize(0, 1, 0.5));
assert.deepEqual([1, 0.5, 0], Range_1.Range.byStepSize(1, 0, -0.5));
assert.deepEqual([0, 0.5, 1], Range_1.Range.byStepCount(0, 1, 3));
assert.deepEqual([1, 0.5, 0], Range_1.Range.byStepCount(1, 0, 3));
