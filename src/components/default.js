import useActive from "lib/hooks/use-active";
import Results from "./results";
import Status from "./status";
import Survey from "./survey";

export default function Default() {
  const active = useActive();

  if(!active) { return <Status />; }
  if(active.loading) { return <Status />; }
  if(active.surveyType === "external") { return <Status />; }

  return active.completed ? <Results /> : <Survey />;
}
