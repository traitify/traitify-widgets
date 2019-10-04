/* eslint-disable import/prefer-default-export */
export function unique(array) {
  return array.filter((x, index) => array.indexOf(x) === index);
}
