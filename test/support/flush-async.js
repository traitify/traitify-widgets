import {act} from "react-test-renderer";

export default function flushAsync() {
  return act(() => new Promise(setImmediate));
}
