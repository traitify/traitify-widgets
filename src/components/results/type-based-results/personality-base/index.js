import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityBlend from "../personality-blend";
import PersonalityType from "../personality-type";

class PersonalityBase extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityBase.initialized", this);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    return this.props.assessment.personality_blend ? (
      <PersonalityBlend {...this.props} />
    ) : (
      <PersonalityType {...this.props} />
    );
  }
}

export {PersonalityBase as Component};
export default withTraitify(PersonalityBase);
