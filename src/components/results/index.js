import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import CandidateResults from "./candidate-results";
import CognitiveResults from "./cognitive-results";
import DimensionBasedResults from "./dimension-based-results";
import EdmResults from "./edm-results";
import FinancialRiskResults from "./financial-risk-results";
import TypeBasedResults from "./type-based-results";

class Results extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      assessment_type: PropTypes.string,
      scoring_scale: PropTypes.string
    }),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("Results.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("Results.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    if(this.props.getOption("surveyType") === "cognitive") {
      return <CognitiveResults {...this.props} />;
    } else if(this.props.assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP") {
      return <FinancialRiskResults {...this.props} />;
    } else if(this.props.assessment.assessment_type === "TYPE_BASED") {
      return <TypeBasedResults {...this.props} />;
    } else if(this.props.getOption("view") === "candidate") {
      return <CandidateResults {...this.props} />;
    } else if(this.props.getOption("view") === "edm") {
      return <EdmResults {...this.props} />;
    } else {
      return <DimensionBasedResults {...this.props} />;
    }
  }
}

export {Results as Component};
export default withTraitify(Results);
