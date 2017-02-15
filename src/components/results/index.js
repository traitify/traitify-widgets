import { h, Component } from "preact";
import TypeBasedResults from "./type-based-results";
import DimensionBasedResults from "./dimension-based-results";

export default class Results extends Component {
  render() {
    var assessment = this.props.assessment || {}
    if(!assessment.personality_types) return <div />

    console.log(assessment)
    if(assessment.assessment_type == "TYPE_BASED") {
      return <TypeBasedResults {...this.props} />
    } else {
      return <DimensionBasedResults {...this.props} />
    }
  }
}
