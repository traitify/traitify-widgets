import useActive from "lib/hooks/use-active";
import useOrder from "lib/hooks/use-order";
import Results from "./results";
import Status from "./status";
import Survey from "./survey";

export default function Default() {
  const active = useActive();
  const order = useOrder();

  if(order?.status === "skipped") { return <Status />; }
  if(!active) { return <Status />; }
  if(active.loading) { return <Status />; }
  if(active.surveyType === "external") { return <Status />; }

  return active.completed ? <Results /> : <Survey />;
}
