import { h, Component } from "preact";
import Dimensions from "./dimensions";
import PersonalityTypes from "./personality-types";

export default class Results extends Component {
  render() {
    var assessment = this.props.assessment || {}
    if(!assessment.personality_types) return <div />

    if(assessment.assessment_type == "TYPE_BASED") {
      // return <PersonalityTypes {...this.props} />
      console.warn("Assessment Type not supported yet");
      return <div />;
    } else {
      return <Dimensions {...this.props} />;
    }
  }
}
