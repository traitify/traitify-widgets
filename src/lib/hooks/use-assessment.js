import useActive from "lib/hooks/use-active";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeAssessmentQuery} from "lib/recoil";

export default function useAssessment({surveyType} = {}) {
  const active = useActive();
  const assessment = useLoadedValue(activeAssessmentQuery);

  if(!active) { return null; }
  if(surveyType && active.surveyType !== surveyType) { return null; }

  return assessment;
}
