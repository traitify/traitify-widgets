import useLoadedValue from "lib/hooks/use-loaded-value";
import {httpState} from "lib/recoil";

export default function useHttp() {
  return useLoadedValue(httpState);
}
