import {subtract} from "./array";

export function dig(object, ...keys) {
  const reducer = (result, key) => (result && result[key] != null ? result[key] : null);

  return keys.reduce(reducer, object);
}

export function mutable(object) {
  if(object === null || typeof object !== "object") { return object; }
  if(Array.isArray(object)) { return object.map((item) => mutable(item)); }

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, mutable(value)])
  );
}

export function slice(object, keys) {
  return keys.reduce((newObject, key) => ({...newObject, [key]: object[key]}), {});
}

export function toQueryString(object) { return new URLSearchParams(object).toString(); }

// Depends on other functions
export function except(object, keys) { return slice(object, subtract(Object.keys(object), keys)); }
export function remap(object, mapping) {
  const existingKeys = Object.keys(mapping);

  return existingKeys.reduce(
    (newObject, key) => ({...newObject, [mapping[key]]: object[key]}),
    except(object, existingKeys)
  );
}
