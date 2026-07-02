import Report from "components/report";
import AttractReport from "components/report/attract";
import Cognitive from "components/results/cognitive";
import FinancialRiskResults from "components/results/financial-risk";
import RJP from "components/results/rjp";
import Redacted from "components/status/redacted";
import Skipped from "components/status/skipped";
import useActive from "lib/hooks/use-active";
import useComponentEvents from "lib/hooks/use-component-events";
import useRedacted from "lib/hooks/use-redacted";
import useResults from "lib/hooks/use-results";

export default function Results() {
  const active = useActive();
  const redacted = useRedacted();
  const results = useResults({surveyType: "personality"});

  useComponentEvents("Results");

  if(!active) { return null; }
  if(active.skipped) { return <Skipped />; }
  if(!active.completed) { return null; }
  if(redacted) { return <Redacted />; }
  if(active.surveyType === "cognitive") { return <Cognitive />; }
  if(active.surveyType === "generic") { return <Report />; }
  if(active.surveyType === "rjp") { return <RJP />; }
  if(active.surveyType !== "personality") { return null; }
  if(!results) { return null; }
  if(results.scoring_scale === "LIKERT_CUMULATIVE_POMP") {
    return <FinancialRiskResults />;
  }
  if(results.assessment_type === "TYPE_BASED") { return <AttractReport />; }

  return <Report />;
}
