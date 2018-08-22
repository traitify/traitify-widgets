import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

class Results extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("Results.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    return (this.props.assessment.assessment_type === "TYPE_BASED") ? (
      <TypeBasedResults {...this.props} />
    ) : (
      <DimensionBasedResults {...this.props} />
    );
  }
}

export {Results as Component};
export default withTraitify(Results);
