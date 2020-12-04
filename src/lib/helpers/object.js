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
