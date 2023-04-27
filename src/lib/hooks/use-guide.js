import useLoadedValue from "lib/hooks/use-loaded-value";
import {guideQuery} from "lib/recoil";

export default function useGuide() {
  return useLoadedValue(guideQuery);
}
