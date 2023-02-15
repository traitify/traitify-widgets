import useLoadedValue from "lib/hooks/use-loaded-value";
import {listenerState} from "lib/recoil";

export default function useListener() {
  return useLoadedValue(listenerState);
}
