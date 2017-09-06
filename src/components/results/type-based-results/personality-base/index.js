import {h, Component} from "preact";

import PersonalityBlend from "../personality-blend";
import PersonalityType from "../personality-type";

export default class PersonalityBase extends Component{
  render(){
    if(!this.props.resultsReady()) return <div />;

    return this.props.assessment.personality_blend ? (
      <PersonalityBlend {...this.props} />
    ) : (
      <PersonalityType {...this.props} />
    );
  }
}
