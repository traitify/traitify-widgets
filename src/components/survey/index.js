import Status from "components/status";
import useActive from "lib/hooks/use-active";
import Cognitive from "./cognitive";
import Personality from "./personality";

export default function Survey() {
  const active = useActive();

  if(!active) { return null; }
  if(active.type === "cognitive") { return <Cognitive />; }
  if(active.type === "external") { return <Status />; }
  if(active.type === "personality") { return <Personality />; }

  return null;
}
