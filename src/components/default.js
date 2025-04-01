import useActive from "lib/hooks/use-active";
import useOrder from "lib/hooks/use-order";
import Results from "./results";
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

  console.log(order);
  if(!active) { return null; } // TODO: Maybe show loading if there's an order or something
  if(active.loading) { return null; }
  if(active.completed) { return <Results />; }

  return <Survey />;
}
