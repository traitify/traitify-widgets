export default function camelCase(string) {
  return string.toLowerCase().replace(/(_|-)([a-z])/g, (x) => (x[1].toUpperCase()));
}
