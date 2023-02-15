import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery} from "lib/recoil";

export default function useAssessment() {
  const assessment = useLoadedValue(assessmentQuery);

  return assessment;
}
