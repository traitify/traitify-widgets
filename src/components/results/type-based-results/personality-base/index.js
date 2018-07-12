import Component from "components/traitify-component";
import PersonalityBlend from "../personality-blend";
import PersonalityType from "../personality-type";

export default class PersonalityBase extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityBase.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();

    return this.state.assessment.personality_blend ? (
      <PersonalityBlend options={options} />
    ) : (
      <PersonalityType options={options} />
    );
  }
}
