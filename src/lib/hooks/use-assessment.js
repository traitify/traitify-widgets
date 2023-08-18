import useActive from "lib/hooks/use-active";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery} from "lib/recoil";

export default function useAssessment({type} = {}) {
  const active = useActive();
  const assessment = useLoadedValue(assessmentQuery);

  if(!active) { return null; }
  if(type && active.type !== type) { return null; }

  return assessment;
}
