import Component from "components/traitify-component";
import PersonalityBadge from "../personality-badge";
import style from "./style";

export default class PersonalityBlend extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityBlend.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const blend = this.state.assessment.personality_blend;
    if(!blend){ return; }

    const options = this.copyOptions();

    return (
      <div class={style.blend}>
        <PersonalityBadge type={blend.personality_type_1} options={options} />
        <PersonalityBadge type={blend.personality_type_2} options={options} />
        <h3 class={style.name}>{blend.name}</h3>
        <p class={style.description}>{blend.description}</p>
      </div>
    );
  }
}
