import {act} from "react-test-renderer";
// NOTE: Relative path necessary until RJP is merged
import times from "../../src/lib/common/array/times";

export default function flushAsync(count = 1) {
  return act(async() => {
    if(count === Infinity) {
      await jest.runAllTimersAsync();

      return;
    }

    await times(count).reduce(
      (promise) => promise.then(() => jest.runOnlyPendingTimersAsync()),
      Promise.resolve()
    );
  });
}
