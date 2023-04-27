export default function get(object, key, fallback) {
  if(!object) { return fallback; }

  return Object.hasOwn(object, key) ? object[key] : fallback;
}
