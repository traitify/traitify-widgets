import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import PersonalityTypeSlide from "../personality-type-slide";
import TypeButton from "./type-button";
import style from "./style";

class PersonalityTypeSlider extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeSlider.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.props.traitify.ui.current["Assessment.activeType"]});
    });

    const activeType = this.props.traitify.ui.current["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  setActive = (type)=>{
    this.props.traitify.ui.trigger("PersonalityTypeSlider.changeType", this, type);
    this.props.traitify.ui.trigger("Assessment.activeType", this, type);
  }
  render(){
    if(!this.props.isReady("results")){ return; }

    const {activeType} = this.state;
    const {assessment} = this.props;

    let backType, nextType;
    if(activeType){
      const id = activeType.personality_type.id;
      const index = assessment.personality_types.findIndex((type)=>type.personality_type.id === id);
      backType = assessment.personality_types[index - 1];
      nextType = assessment.personality_types[index + 1];
    }

    return (
      <div class={style.slider}>
        {backType && (
          <TypeButton style={style.back} type={backType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </TypeButton>
        )}
        <ul>
          {this.props.assessment.personality_types.map((type)=>(
            <PersonalityTypeSlide type={type} {...this.props} />
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

export {PersonalityTypeSlider as Component};
export default withTraitify(PersonalityTypeSlider);
