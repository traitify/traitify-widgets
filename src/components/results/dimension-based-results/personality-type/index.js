import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class Type extends Component{
  constructor(props){
    super(props);

    this.state = {showContent: props.index === 0};
  }
  trigger = (e)=>{
    e.preventDefault();

    this.props.traitify.ui.trigger("PersonalityType.showContent", this, this.props.type.personality_type);
    this.setState({showContent: !this.state.showContent});
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityType.initialized", this);
  }
  render(){
    const type = this.props.type.personality_type;
    const color = `#${type.badge.color_1}`;
    let benefits = [];
    let pitfalls = [];

    type.details.forEach((detail)=>{
      if(detail.title === "Benefits") benefits.push(detail.body);
      if(detail.title === "Pitfalls") pitfalls.push(detail.body);
    });

    return (
      <li class={style.type} style={`border-left: 5px solid ${color};`}>
        <div class={style.main} style={`background: ${rgba(color, 8.5)};`}>
          <div class={style.content}>
            <h2 class={style.title}>{type.name} <span class={style.score}>{this.props.type.score} - {type.level}</span></h2>
          </div>
        </div>
      </li>
    );
  }
}

export {Type as Component};
export default withTraitify(Type);
