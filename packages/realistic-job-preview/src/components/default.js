import useAssessment from "lib/hooks/use-assessment";
import Results from "./results";
import Survey from "./survey";

export default function Default() {
  const assessment = useAssessment();

  if(!assessment) { return null; }
  if(assessment.completedAt) { return <Results />; }

  return <Survey />;
}
