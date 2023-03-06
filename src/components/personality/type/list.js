import PersonalityTypeChart from "components/personality/type/chart";
import useComponentEvents from "lib/hooks/use-component-events";

export default function PersonalityTypeList() {
  useComponentEvents("PersonalityTypes");

  return <PersonalityTypeChart />;
}
