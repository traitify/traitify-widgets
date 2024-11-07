/* eslint-disable no-param-reassign */
import isObject from "./is-object";

export default function merge(...objects) {
  return objects.reduce((target, source) => {
    Object.keys(source).forEach((key) => {
      if(Array.isArray(target[key]) && Array.isArray(source[key])) {
        target[key] = target[key].concat(...source[key]);
      } else if(isObject(target[key]) && isObject(source[key])) {
        target[key] = merge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });

    return target;
  }, {});
}
