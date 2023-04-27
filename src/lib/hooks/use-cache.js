import useLoadedValue from "lib/hooks/use-loaded-value";
import {cacheState} from "lib/recoil";

export default function useCache() {
  return useLoadedValue(cacheState);
}
