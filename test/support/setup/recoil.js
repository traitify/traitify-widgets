/* eslint-disable */
import {selector, snapshot_UNSTABLE} from "recoil";

const clearSelectorCachesState = selector({
  key: "ClearSelectorCaches",
  get: ({getCallback}) => getCallback(({snapshot, refresh}) => () => {
    for (const node of snapshot.getNodes_UNSTABLE()) {
      refresh(node);
    }
  }),
});

afterEach(async() => {
  const snapshot = snapshot_UNSTABLE();
  const clearSelectorCaches = snapshot.getLoadable(clearSelectorCachesState).getValue();

  clearSelectorCaches();
});
