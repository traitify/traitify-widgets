export {default as isObject} from "./is-object";

export function isArray(value) {
  return Array.isArray(value);
}

export function isNumber(value) {
  return typeof value === "number";
}

export function isString(value) {
  return typeof value === "string" || value instanceof String;
}
