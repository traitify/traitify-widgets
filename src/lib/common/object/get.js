export default function get(object, key, fallback) {
  return Object.hasOwn(object, key) ? object[key] : fallback;
}
