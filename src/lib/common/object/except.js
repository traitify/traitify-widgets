import slice from "./slice";
import subtract from "../array/subtract";

export default function except(object, keys) {
  return slice(object, subtract(Object.keys(object), keys));
}
