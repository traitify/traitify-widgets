import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentsState} from "lib/recoil";

export default function useAssessments() {
  return useLoadedValue(assessmentsState);
}
