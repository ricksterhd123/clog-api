const { getPathRoot } = require('../utils/path');

test('Fails when no stage or rawPath is provided', () => {
    const tests = [
        { stage: 'dev', rawPath: null, expected: false },
        { stage: null, rawPath: '/dev/a', expected: false },
        { stage: null, rawPath: null, expected: false },
    ];

    for (let i = 0; i < tests.length; i += 1) {
        const { stage, rawPath, expected } = tests[i];
        expect(getPathRoot(stage, rawPath)).toBe(expected);
    }
});

test('Gets path root from rawPath', () => {
    const tests = [
        { stage: 'dev', rawPath: '/dev/a', expected: 'a' },
        { stage: 'dev', rawPath: '/dev/ab', expected: 'ab' },
        { stage: 'dev', rawPath: '/dev/abc', expected: 'abc' },
        { stage: 'dev', rawPath: '/dev/', expected: '' },
    ];

    for (let i = 0; i < tests.length; i += 1) {
        const { stage, rawPath, expected } = tests[i];
        expect(getPathRoot(stage, rawPath)).toBe(expected);
    }
});

test('Fails when rawPath invalid', () => {
    const tests = [
        { stage: 'dev', rawPath: '/dev', expected: false },
        { stage: 'dev', rawPath: '/', expected: false },
    ];

    for (let i = 0; i < tests.length; i += 1) {
        const { stage, rawPath, expected } = tests[i];
        expect(getPathRoot(stage, rawPath)).toBe(expected);
    }
});
