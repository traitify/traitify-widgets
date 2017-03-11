import { h, Component } from "preact";
import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

export default class Results extends Component {
  render() {
    let assessment = this.props.assessment || {};
    if (!assessment.personality_types) return <div />;
    
    let results;
    if (assessment.assessment_type == "TYPE_BASED"){
      results = <TypeBasedResults {...this.props} />;
    } else {
      results = <DimensionBasedResults {...this.props} />;
    }
    return results;
  }
}
