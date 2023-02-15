import useAssessment from "lib/hooks/use-assessment";

// TODO: only return if there are results
export default function useResults() {
  const assessment = useAssessment();

  return assessment;
}
