import useActive from "lib/hooks/use-active";
import useAssessment from "lib/hooks/use-assessment";

export default function useResults(type = "personality") {
  const active = useActive();
  const assessment = useAssessment(type);

  if(!active) { return null; }
  if(!active.completed) { return null; }
  if(!assessment) { return null; }

  return assessment;
}
