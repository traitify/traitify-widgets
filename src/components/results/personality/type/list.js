import PersonalityTypeChart from "components/results/personality/type/chart";
import useComponentEvents from "lib/hooks/use-component-events";

export default function PersonalityTypeList() {
  useComponentEvents("PersonalityTypes");

  return <PersonalityTypeChart />;
}
