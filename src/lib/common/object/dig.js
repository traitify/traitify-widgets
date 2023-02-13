export default function dig(object, ...keys) {
  const reducer = (result, key) => (result && result[key] != null ? result[key] : null);

  return keys.reduce(reducer, object);
}
