import CandidateReport from "components/report/candidate";
import EmployeeReport from "components/report/employee";
import ManagerReport from "components/report/manager";
import useOption from "lib/hooks/use-option";

export default function Report() {
  const report = useOption("report");

  if(report === "candidate") { return <CandidateReport />; }
  if(report === "employee") { return <EmployeeReport />; }
  if(report === "manager") { return <ManagerReport />; }

  return <CandidateReport />;
}
