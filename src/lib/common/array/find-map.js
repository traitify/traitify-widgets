export default function findMap(array, callback) {
  let result;
  array.some((item, index) => {
    result = callback(item, index);
    return result;
  });
  return result || undefined;
}
