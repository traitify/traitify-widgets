import useLoadedValue from "lib/hooks/use-loaded-value";
import {recommendationsState} from "lib/recoil";

export default function useRecommendations() {
  return useLoadedValue(recommendationsState);
}
