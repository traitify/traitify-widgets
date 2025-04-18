import useActive from "lib/hooks/use-active";
import useOrder from "lib/hooks/use-order";
import Results from "./results";
import Status from "./status";
import Survey from "./survey";

// TODO: Add loading component?
//   - Component renders loading until either
//     - a loaded incomplete assessment is returned
//     - all loaded complete assessments are returned
//   - If active is incomplete and external, render status, cached "loading" for x seconds
//   - If active is incomplete and internal, render survey
//   - If all complete are returned, render results
//   - If active loading and order gave up, render error
//     - maybe active.error? maybe just errorState => reset errorState on reload event

// TODO: Depending on design, may need to differentiate loading page based on baseState
// - Also, if base state is empty, no loading
export default function Default() {
  const active = useActive();
  const order = useOrder();

  console.log("default - order", order);
  console.log("default - active", active);
  if(!active) { return <Status />; }
  if(active.error) { return <Status />; } // TODO: See if error state makes it to active
  if(active.loading) { return <Status />; }
  if(active.surveyType === "external") { return <Status />; }

  return active.completed ? <Results /> : <Survey />;
}
