export function flushPromises() { return new Promise(setImmediate); }

export function mockOptions(fn, options) { return fn.mockImplementation((key) => options[key]); }
