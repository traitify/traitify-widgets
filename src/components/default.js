import dig from "lib/common/object/dig";
import useAssessment from "lib/hooks/use-assessment";
import useResults from "lib/hooks/use-results";
import Results from "./results";
import Survey from "./survey";

export default function Default() {
  const assessment = useAssessment();
  const results = useResults();

  if(results) { return <Results />; }
  if(dig(assessment, "slides")) { return <Survey />; }

  return null;
}
