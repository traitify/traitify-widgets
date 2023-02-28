export default function split(object, keys) {
  const included = {};
  const excluded = {};

  Object.keys(object).forEach((key) => {
    (keys.includes(key) ? included : excluded)[key] = object[key];
  });

  return [included, excluded];
}
