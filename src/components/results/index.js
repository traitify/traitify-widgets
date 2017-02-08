import { h, Component } from "preact";
import Dimensions from "./dimensions";
import PersonalityTypes from "./personality-types";

export default class Results extends Component {
  render() {
    if(!this.props.assessment) { return <div /> }

    if(this.props.assessment.assessment_type == "type_based") {
      console.warn("Assessment Type not supported yet");
      // return <PersonalityTypes {...this.props} />
      return <div />
    } else {
      return <Dimensions {...this.props} />
    }
  }
}
