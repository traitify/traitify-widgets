export default function unique(array) {
  return array.reduce((all, item) => (all.includes(item) ? all : [...all, item]), []);
}
