import useActive from "lib/hooks/use-active";
import Results from "./results";
import Survey from "./survey";

export default function Default() {
  const active = useActive();

  if(!active) { return null; }
  if(active.loading) { return null; }
  if(active.completed) { return <Results />; }

  return <Survey />;
}
