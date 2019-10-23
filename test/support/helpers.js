/* eslint-disable import/prefer-default-export */
export function flushPromises() { return new Promise(setImmediate); }
