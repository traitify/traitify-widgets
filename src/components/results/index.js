import { h, Component } from "preact";

import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

export default class Results extends Component {
  componentDidMount(){
    this.props.triggerCallback("Results", "initialized", this);
  }
  render() {
    return (this.props.assessment.assessment_type == "TYPE_BASED") ? (
      <TypeBasedResults {...this.props} />
    ) : (
      <DimensionBasedResults {...this.props} />
    );
  }
}
