import {useRecoilValue} from "recoil";
import {careerState, currentCareerIDState} from "lib/recoil";

export default function useCareer(id) {
  const currentID = useRecoilValue(currentCareerIDState);

  return useRecoilValue(careerState(id || currentID));
}
