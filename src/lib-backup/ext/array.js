export function subtract(array1, array2) { return array1.filter((x) => !array2.includes(x)); }

export function unique(array) {
  return array.filter((x, index) => array.indexOf(x) === index);
}
