import Status from "components/status";
import useActive from "lib/hooks/use-active";
import Cognitive from "./cognitive";
import Personality from "./personality";

export default function Survey() {
  const active = useActive();

  if(!active) { return <Status />; }
  if(active.surveyType === "cognitive") { return <Cognitive />; }
  if(active.surveyType === "external") { return <Status />; }
  if(active.surveyType === "personality") { return <Personality />; }

  return null;
}
