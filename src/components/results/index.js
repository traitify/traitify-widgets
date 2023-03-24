import AttractReport from "components/report/attract";
import CandidateReport from "components/report/candidate";
import EmployeeReport from "components/report/employee";
import ManagerReport from "components/report/manager";
import CognitiveResults from "components/results/cognitive";
import FinancialRiskResults from "components/results/financial-risk";
import useComponentEvents from "lib/hooks/use-component-events";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";

export default function Results() {
  const results = useResults();
  const report = useOption("report");
  const surveyType = useOption("surveyType");

  useComponentEvents("Results");

  if(!results) { return null; }
  if(surveyType === "cognitive") { return <CognitiveResults />; }
  if(results.scoring_scale === "LIKERT_CUMULATIVE_POMP") {
    return <FinancialRiskResults />;
  }
  if(results.assessment_type === "TYPE_BASED") { return <AttractReport />; }
  if(report === "candidate") { return <CandidateReport />; }
  if(report === "employee") { return <EmployeeReport />; }
  if(report === "manager") { return <ManagerReport />; }

  return <CandidateReport />;
}
