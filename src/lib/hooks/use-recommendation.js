import useLoadedValue from "lib/hooks/use-loaded-value";
import {recommendationState} from "lib/recoil";

export default function useRecommendation() {
  return useLoadedValue(recommendationState);
}
