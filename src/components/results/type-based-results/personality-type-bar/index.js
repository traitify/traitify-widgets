import { h, Component } from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityTypeBar extends Component {
  constructor() {
    super();
    this.setActive = this.setActive.bind(this);
  }
  setActive() {
    this.props.setState({ activeType: this.props.type });
  }
  render() {
    var type = this.props.type.personality_type;
    var title = type.name;
    var icon = type.badge.image_medium;
    var color = `#${type.badge.color_1}`;
    var score = Math.round(this.props.type.score);

    var active = false;
    var activeType = this.props.activeType;
    if(activeType) {
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
