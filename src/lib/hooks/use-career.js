import useLoadedValue from "lib/hooks/use-loaded-value";
import {careerState} from "lib/recoil";

export default function useCareer() {
  return useLoadedValue(careerState);
}
