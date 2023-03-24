import useAssessment from "lib/hooks/use-assessment";

export default function useResults() {
  const assessment = useAssessment();
  if(!assessment) { return null; }
  if(!assessment.completed_at) { return null; }

  return assessment;
}
