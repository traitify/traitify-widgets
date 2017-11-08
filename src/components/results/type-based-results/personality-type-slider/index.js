import {h, Component} from "preact";
import style from "./style";

import PersonalityTypeSlide from "../personality-type-slide";

class TypeButton extends Component{
  constructor(){
    super();
    this.setActive = this.setActive.bind(this);
  }
  setActive(e){
    e.preventDefault();
    this.props.setActive(this.props.type);
  }
  render(){
    return (
      <a class={this.props.style} href="#" onClick={this.setActive}>
        {this.props.children}
      </a>
    );
  }
}

export default class PersonalityTypeSlider extends Component{
  constructor(){
    super();
    this.setActive = this.setActive.bind(this);
  }
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypeSlider", "initialized", this);
  }
  setActive(type){
    this.props.triggerCallback("PersonalityTypeSlider", "changeType", this, type);
    this.props.setState({activeType: type});
  }
  render(){
    if(!this.props.resultsReady(this.props.assessment)) return <div />;

    let props = this.props;
    let id, ids, index, backType, nextType;
    if(props.activeType){
      id = props.activeType.personality_type.id;
      ids = props.assessment.personality_types.map((type)=>{ return type.personality_type.id; });
      index = ids.indexOf(id);
      backType = props.assessment.personality_types[index - 1];
      nextType = props.assessment.personality_types[index + 1];
    }

    return (
      <div class={style.slider}>
        {backType && (
          <TypeButton style={style.back} type={backType} setActive={this.setActive}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </TypeButton>
        )}
        <ul>
          {props.assessment.personality_types.map((type)=>{
            return <PersonalityTypeSlide {...props} type={type} />;
          })}
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
