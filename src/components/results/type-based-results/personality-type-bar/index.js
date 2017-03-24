import { h, Component } from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityTypeBar extends Component {
  constructor() {
    super();
    this.setActive = this.setActive.bind(this);
  }
  componentDidMount(){
    this.props.triggerCallback("personalitytypebar", "initialized", this);
  }
  setActive() {
    this.props.triggerCallback("personalitytypebar", "changeType", this, this.props.type);
    this.props.setState({ activeType: this.props.type });
  }
  render() {
    let type = this.props.type.personality_type;
    let title = type.name;
    let icon = type.badge.image_medium;
    let color = `#${type.badge.color_1}`;
    let score = Math.round(this.props.type.score);

    let active = false;
    let activeType = this.props.activeType;
    if (activeType){
      active = type.id == activeType.personality_type.id;
    }

    return (
      <li class={`${style.bar} ${active ? style.selected : ""}`} onMouseOver={this.setActive} onClick={this.setActive}>
        <span class={style.score} style={`background: ${color}; height: ${score}%;`}>{score}%</span>
        <span class={style.label} style={active && `background-color: ${Color.rgba(color, 8.5)}`}>
          <img src={icon} alt={title} />
          <i>{title}</i>
        </span>
      </li>
    );
  }
}
