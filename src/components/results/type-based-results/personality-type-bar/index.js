import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import Color from "lib/color-helpers";
import style from "./style";

class PersonalityTypeBar extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTypeBar.initialized", this);
    this.props.traitify.ui.on("Assessment.activeType", ()=>{
      this.setState({activeType: this.props.traitify.ui.data["Assessment.activeType"]});
    });

    const activeType = this.props.traitify.ui.data["Assessment.activeType"];
    if(activeType){ this.setState({activeType}); }
  }
  setActive = ()=>{
    this.props.traitify.ui.trigger("PersonalityTypeBar.changeType", this, this.props.type);
    this.props.traitify.ui.trigger("Assessment.activeType", this, this.props.type);
  }
  render(){
    const type = this.props.type.personality_type;
    const title = type.name;
    const icon = type.badge.image_medium;
    const color = `#${type.badge.color_1}`;
    const score = Math.round(this.props.type.score);
    const barHeight = Math.round(this.props.barHeight);

    let active = false;
    const activeType = this.state.activeType;
    if(activeType){
      active = type.id === activeType.personality_type.id;
    }

    return (
      <li class={`${style.bar} ${active ? style.selected : ""}`} onMouseOver={this.setActive} onClick={this.setActive}>
        <span class={style.score} style={`background: ${color}; height: ${barHeight}%;`}>{score}%</span>
        <span class={style.label} style={active && `background-color: ${Color.rgba(color, 8.5)}`}>
          <img src={icon} alt={title} />
          <i>{title}</i>
        </span>
      </li>
    );
  }
}

export {PersonalityTypeBar as Component};
export default withTraitify(PersonalityTypeBar);
