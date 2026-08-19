import useAssessments from "lib/hooks/use-assessments";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import Crosschq from "./crosschq";

export default function External() {
  const disabled = useDisabledComponent("ExternalResults");
  const allAssessments = useAssessments() || [];
  const assessments = allAssessments
    .filter(({completed}) => completed)
    .filter(({surveyType}) => surveyType === "external")
    .filter(({vendor}) => vendor === "crosschq");

  useComponentEvents("ExternalResults");

  if(disabled) { return null; }
  if(assessments.length === 0) { return null; }

  return assessments.map((assessment) => (
    <Crosschq key={assessment.id} id={assessment.id} />
  ));
}
