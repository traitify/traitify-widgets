import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery} from "lib/recoil";

export default function useAssessment() {
  return useLoadedValue(assessmentQuery);
}
