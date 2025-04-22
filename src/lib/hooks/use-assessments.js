import {useRecoilValue} from "recoil";
import {assessmentsState} from "lib/recoil";

export default function useAssessments() {
  return useRecoilValue(assessmentsState);
}
