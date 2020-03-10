/* eslint-disable import/prefer-default-export */
export function mutable(data) { return data.map((item) => ({...item})); }
