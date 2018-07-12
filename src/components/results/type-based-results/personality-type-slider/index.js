import Component from "components/traitify-component";
import PersonalityTypeSlide from "../personality-type-slide";
import TypeButton from "./type-button";
import style from "./style";

export default class PersonalityTypeSlider extends Component{
  componentDidMount(){
    this.traitify.ui.trigger("PersonalityTypeSlider.initialized", this);
    this.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.traitify.ui.data["Assessment.activeType"]});
    });
    this.followAssessment();

    const activeType = this.traitify.ui.data["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  componentDidUpdate(){
    this.followAssessment();
  }
  setActive = (type)=>{
    this.traitify.ui.trigger("PersonalityTypeSlider.changeType", this, type);
    this.traitify.ui.trigger("Assessment.activeType", this, type);
  }
  render(){
    if(!this.isReady("results")){ return; }

    const {activeType, assessment} = this.state;

    let backType, nextType;
    if(activeType){
      const id = activeType.personality_type.id;
      const index = assessment.personality_types.findIndex((type)=>type.personality_type.id === id);
      backType = assessment.personality_types[index - 1];
      nextType = assessment.personality_types[index + 1];
    }

    const options = this.copyOptions();

    return (
      <div class={style.slider}>
        {backType && (
          <TypeButton style={style.back} type={backType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </TypeButton>
        )}
        <ul>
          {this.state.assessment.personality_types.map((type)=>(
            <PersonalityTypeSlide type={type} options={options} />
          ))}
        </ul>
        {nextType && (
          <TypeButton style={style.next} type={nextType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/arrow_right.svg" alt="Next" />
          </TypeButton>
        )}
      </div>
    );
  }
}
