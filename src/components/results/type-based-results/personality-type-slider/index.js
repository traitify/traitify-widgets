import { h, Component } from "preact";
import style from "./style";

import PersonalityTypeSlide from "../personality-type-slide";

export default class PersonalityTypeSlider extends Component {
  constructor() {
    super();
    this.setActive = this.setActive.bind(this);
  }
  componentDidMount(){
    this.props.triggerCallback("personalitytypeslider", "initialized", this);
  }
  setActive(type, e) {
    e.preventDefault();
    this.props.triggerCallback("personalitytypeslider", "changeType", this, type);
    this.props.setState({ activeType: type });
  }
  render() {
    let props = this.props;
    let id, ids, index, backType, nextType;
    if (props.activeType){
      id = props.activeType.personality_type.id;
      ids = props.assessment.personality_types.map((type) => { return type.personality_type.id; });
      index = ids.indexOf(id);
      backType = props.assessment.personality_types[index - 1];
      nextType = props.assessment.personality_types[index + 1];
    }

    return (
      <div class={style.slider}>
        {backType && (
          <a class={style.back} href="#" onClick={this.setActive.bind(null, backType)}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </a>
        )}
        <ul>
          {props.assessment.personality_types.map((type)=>{
            return <PersonalityTypeSlide {...props} type={type} />;
          })}
        </ul>
        {nextType && (
          <a class={style.next} href="#" onClick={this.setActive.bind(null, nextType)}>
            <img src="https://cdn.traitify.com/assets/images/arrow_right.svg" alt="Next" />
          </a>
        )}
      </div>
    );
  }
}
