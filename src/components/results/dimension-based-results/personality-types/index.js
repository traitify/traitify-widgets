import {h, Component} from "preact";
import PersonalityType from "../personality-type";
import style from "./style";

export default class Types extends Component{
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypes", "initialized", this);
  }
  render(){
    if(!this.props.resultsReady(this.props.assessment)) return <div />;

    let props = this.props;
    return (
      <ul class={style.types}>
        {props.assessment.personality_types.map((type)=>{
          return <PersonalityType personalityType={type} {...props} />;
        })}
      </ul>
    );
  }
}
