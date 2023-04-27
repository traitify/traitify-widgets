import useActive from "lib/hooks/use-active";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {assessmentQuery} from "lib/recoil";

export default function useAssessment(type = "personality") {
  const active = useActive();
  const assessment = useLoadedValue(assessmentQuery);

  if(!active) { return null; }
  if(active.type !== type) { return null; }

  return assessment;
}
