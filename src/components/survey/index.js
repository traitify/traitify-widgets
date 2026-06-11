import Status from "components/status";
import useActive from "lib/hooks/use-active";
import Cognitive from "./cognitive";
import Generic from "./generic";
import Personality from "./personality";
import RJP from "./rjp";

export default function Survey() {
  const active = useActive();

  if(!active) { return <Status />; }
  if(active.surveyType === "cognitive") { return <Cognitive />; }
  if(active.surveyType === "external") { return <Status />; }
  if(active.surveyType === "generic") { return <Generic />; }
  if(active.surveyType === "personality") { return <Personality />; }
  if(active.surveyType === "rjp") { return <RJP />; }

  return null;
}
