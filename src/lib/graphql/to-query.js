export default function toQuery(object) {
  if(Array.isArray(object)) {
    return object.map((value) => toQuery(value)).join(" ");
  } else if(typeof object === "object") {
    return Object.keys(object).map((key) => `${key} { ${toQuery(object[key])} }`).join(" ");
  } else {
    return object;
  }
}
