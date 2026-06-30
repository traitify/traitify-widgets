import useLoadedValue from "lib/hooks/use-loaded-value";
import {surveyQuery} from "lib/recoil";

export default function useSurvey({surveyType} = {}) {
  return useLoadedValue(surveyQuery(surveyType));
}
