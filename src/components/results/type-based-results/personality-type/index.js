import Component from "components/traitify-component";
import PersonalityBadge from "../personality-badge";
import style from "./style";

export default class PersonalityType extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityType.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const type = this.state.assessment.personality_types[0].personality_type;
    const options = this.copyOptions();

    return (
      <div class={style.type}>
        <PersonalityBadge type={type} options={options} />
        <h3 class={style.name}>{type.name}</h3>
        <p class={style.description}>{type.description}</p>
      </div>
    );
  }
}
