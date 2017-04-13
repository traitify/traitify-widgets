import { h, Component } from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityTypeSlide extends Component {
  componentDidMount(){
    this.props.triggerCallback("PersonalityTypeSlide", "initialized", this);
  }
  position() {
    if (!this.props.activeType) return "none";

    let id = this.props.type.personality_type.id;
    let activeID = this.props.activeType.personality_type.id;
    if (id == activeID) return "middle";

    return "none";
  }
  render() {
    let position = this.position();
    if (position == "none") return <div />;

    let type = this.props.type.personality_type;
    let color = `#${type.badge.color_1}`;
    let name = type.description.split("'")[1];
    let description = type.description.split("'").splice(2).join("'");

    return (
      <li class={`${style.slide} ${style[position]}`} style={`background: ${Color.rgba(color, 8.5)};`}>
        <span class={style.title} style={`color: ${color}`}>{name}</span>
        {description}
      </li>
    );
  }
}
