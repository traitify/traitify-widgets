export default function slice(object, keys) {
  return keys.reduce((newObject, key) => ({...newObject, [key]: object[key]}), {});
}
