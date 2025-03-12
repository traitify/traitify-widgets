import AttractReport from "components/report/attract";
import CandidateReport from "components/report/candidate";
import EmployeeReport from "components/report/employee";
import ManagerReport from "components/report/manager";
import Cognitive from "components/results/cognitive";
import FinancialRiskResults from "components/results/financial-risk";
import Skipped from "components/results/skipped";
import useActive from "lib/hooks/use-active";
import useComponentEvents from "lib/hooks/use-component-events";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";

export default function Results() {
  const active = useActive();
  const report = useOption("report");
  const results = useResults({type: "personality"});

  useComponentEvents("Results");

  if(!active) { return null; }
  if(active.skipped) { return <Skipped />; }
  if(!active.completed) { return null; }
  if(active.type === "cognitive") { return <Cognitive />; }
  if(active.type !== "personality") { return null; }
  if(!results) { return null; }
  if(results.scoring_scale === "LIKERT_CUMULATIVE_POMP") {
    return <FinancialRiskResults />;
  }
  if(results.assessment_type === "TYPE_BASED") { return <AttractReport />; }
  if(report === "candidate") { return <CandidateReport />; }
  if(report === "employee") { return <EmployeeReport />; }
  if(report === "manager") { return <ManagerReport />; }

  return <CandidateReport />;
}
