export function camelCase(string) {
  return string.toLowerCase().replace(/(_|-)([a-z])/g, (x) => (x[1].toUpperCase()));
}

export function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}
