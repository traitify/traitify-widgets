import subtract from "lib/common/array/subtract";
import slice from "lib/common/object/slice";

export default function except(object, keys) {
  return slice(object, subtract(Object.keys(object), keys));
}
