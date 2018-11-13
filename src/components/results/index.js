import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

class Results extends Component{
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({assessment_type: PropTypes.string}),
    isReady: PropTypes.func.isRequired
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("Results.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("Results.updated", this);
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    return (this.props.assessment.assessment_type === "TYPE_BASED") ? (
      <TypeBasedResults {...this.props} />
    ) : (
      <DimensionBasedResults {...this.props} />
    );
  }
}

export {Results as Component};
export default withTraitify(Results);
