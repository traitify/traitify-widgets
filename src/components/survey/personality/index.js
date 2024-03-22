import useAssessment from "lib/hooks/use-assessment";
import Image from "./image";
import Text from "./text";

export default function PersonalitySurvey() {
  const assessment = useAssessment({type: "personality"});

  if(!assessment) { return null; }
  if(assessment.slide_type === "text") { return <Text />; }

  return <Image />;
}
