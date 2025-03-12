import useActive from "lib/hooks/use-active";
import Results from "./results";
import Skipped from "./results/skipped";
import Survey from "./survey";

export default function Default() {
  const active = useActive();

  if(!active) { return null; }
  if(active.loading) { return null; }
  if(active.completed) { return <Results />; }
  if(active.skipped) { return <Skipped />; }

  return <Survey />;
}
