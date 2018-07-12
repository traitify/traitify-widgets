import Component from "components/traitify-component";
import PersonalityTrait from "../personality-trait";
import style from "./style";

export default class PersonalityTraits extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTraits.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();
    const traits = this.state.assessment.personality_traits;

    return (
      <div class={style.traits}>
        <h4 class={style.title}>Most Represented Traits</h4>
        {traits.slice(0, 5).map((trait)=>(
          <PersonalityTrait trait={trait} options={options} />
        ))}
        <h4 class={style.title}>Least Represented Traits</h4>
        {traits.slice(-5).map((trait)=>(
          <PersonalityTrait trait={trait} options={options} />
        ))}
      </div>
    );
  }
}
