import useLoadedValue from "lib/hooks/use-loaded-value";
import {completedAssessmentQuery} from "lib/recoil";

export default function useResults({id, surveyType} = {}) {
  return useLoadedValue(completedAssessmentQuery({id, surveyType}));
}
