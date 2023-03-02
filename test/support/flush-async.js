import {act} from "react-test-renderer";

export default function flushAsync() {
  return act(() => (
    new Promise((resolve) => {
      setTimeout(resolve, 100);
      jest.runAllTimers();
    })
  ));
}
