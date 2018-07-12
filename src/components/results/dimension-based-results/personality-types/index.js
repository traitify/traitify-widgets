import Component from "components/traitify-component";
import PersonalityType from "../personality-type";
import style from "./style";

export default class Types extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTypes.initialized", this);
    this.followAssessment();
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  render(){
    if(!this.isReady("results")){ return; }

    const options = this.copyOptions();

    return (
      <ul class={style.types}>
        {this.state.assessment.personality_types.map((type)=>(
          <PersonalityType type={type} options={options} />
        ))}
      </ul>
    );
  }
}
