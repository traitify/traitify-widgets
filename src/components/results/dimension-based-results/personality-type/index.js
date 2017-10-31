import {h, Component} from "preact";
import Color from "color-helpers";
import style from "./style";

export default class Type extends Component{
  constructor(props){
    super(props);
    this.state = {showContent: props.index === 0};
    this.trigger = this.trigger.bind(this);
  }
  trigger(e){
    e.preventDefault();

    this.props.triggerCallback("PersonalityType", "showContent", this, this.props.personalityType.personality_type);
    this.setState({showContent: !this.state.showContent});
  }
  componentDidMount(){
    this.props.triggerCallback("PersonalityType", "initialized", this);
  }
  render(){
    let type = this.props.personalityType.personality_type;
    let benefits = [];
    let pitfalls = [];
    type.details.forEach((detail)=>{
      if(detail.title === "Benefits") benefits.push(detail.body);
      if(detail.title === "Pitfalls") pitfalls.push(detail.body);
    });
    let color = `#${type.badge.color_1}`;
    let perspective = `${(this.props.perspective || "firstPerson").replace("Person", "")}_person_description`;
    let description = type.details.find(detail=>detail.title === perspective);
    description = (description && description.body) || type.description;

    return (
      <li class={style.type} style={`border-left: 5px solid ${color};`}>
        <div class={style.main} style={`background: ${Color.rgba(color, 8.5)};`}>
          <div class={style.content}>
            <h4 class={style.title}>{type.name} <span class={style.score}>{this.props.personalityType.score} - {type.level}</span></h4>
          </div>
        </div>
      </li>
    );
  }
}
