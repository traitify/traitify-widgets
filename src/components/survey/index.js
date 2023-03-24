import useOption from "lib/hooks/use-option";
import Cognitive from "./cognitive";
import Personality from "./personality";

export default function Survey() {
  const surveyType = useOption("surveyType");
  if(surveyType === "cognitive") { return <Cognitive />; }

  return <Personality />;
}
