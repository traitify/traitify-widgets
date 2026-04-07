import isObject from "./is-object";

export default function setPath(object, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let target = object;

  keys.forEach((key) => {
    if(!isObject(target[key])) { target[key] = {}; }

    target = target[key];
  });

  target[lastKey] = value;
}
