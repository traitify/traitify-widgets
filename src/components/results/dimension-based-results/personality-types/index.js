import {h, Component} from "preact";
import PersonalityType from "../personality-type";
import style from "./style";

export default class Types extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypes", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    let props = this.props;
    return (
      <ul class={style.types}>
        {props.assessment.personality_types.map((type, i)=>{
          return <PersonalityType personalityType={type} index={i} {...props} />;
        })}
      </ul>
    );
  }
}
