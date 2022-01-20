import PropTypes from "prop-types";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import CandidateResults from "./candidate-results";
import CognitiveResults from "./cognitive-results";
import DimensionBasedResults from "./dimension-based-results";
import EmployeeResults from "./employee-results";
import FinancialRiskResults from "./financial-risk-results";
import ManagerResults from "./manager-results";
import TypeBasedResults from "./type-based-results";

function Results(props) {
  const {assessment, getOption, isReady, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("Results.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("Results.updated", {props, state}); });

  if(!isReady("results")) { return null; }

  const view = getOption("view");

  if(getOption("surveyType") === "cognitive") { return <CognitiveResults {...props} />; }
  if(assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP") {
    return <FinancialRiskResults {...props} />;
  }
  if(assessment.assessment_type === "TYPE_BASED") { return <TypeBasedResults {...props} />; }
  if(view === "candidate") { return <CandidateResults {...props} />; }
  if(view === "employee") { return <EmployeeResults {...props} />; }
  if(view === "manager") { return <ManagerResults {...props} />; }

  return <DimensionBasedResults {...props} />;
}

Results.defaultProps = {assessment: null};
Results.propTypes = {
  assessment: PropTypes.shape({
    assessment_type: PropTypes.string,
    scoring_scale: PropTypes.string
  }),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Results as Component};
export default withTraitify(Results);
