import {useRecoilValue} from "recoil";
import {careerState} from "lib/recoil";

export default function useCareer() {
  return useRecoilValue(careerState);
}
