export class Range {

    static byStartEnd(start: number, end: number): number[] {
        return Range.byStepSize(start, end, start < end ? 1.0 : -1.0);
    }

    static byStepSize(start: number, end: number, stepSize: number): number[] {

        if (Math.abs(stepSize) <= 1e-12) throw new Error('The step size is too small.');
        if ((stepSize < 0 && (end - start) > 0) ||
            (stepSize > 0 && (end - start) < 0)) throw new Error('The step size will not be able to cover the range.');

        var stepCount = Math.ceil(Math.abs((end - start) / stepSize)) + 1;

        return Range.byStepCount(start, end, stepCount);
    }

    static byStepCount(start: number, end: number, steps: number): number[] {

        if (steps <= 0) throw new Error('The step count must be greater than 0.');
        if (Math.abs(end - start) < 1e-12) throw new Error('The difference between the two ends of the range is too small.');

        var range = [];
        var stepSize = (end - start) / (steps - 1);
        for (var i = 0; i < steps - 1; i++) {
            range.push(start + i * stepSize);
        }

        range.push(end);

        return range;
    }
}