import { h, Component } from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityTypeSlide extends Component {
  position() {
    if(!this.props.activeType) { return "none"; }
    var id = this.props.type.personality_type.id;
    var activeID = this.props.activeType.personality_type.id;
    if(id == activeID) { return "middle"; }

    var ids = this.props.assessment.personality_types.map((type) => { return type.personality_type.id; });
    var index = ids.indexOf(id);
    var activeIndex = ids.indexOf(activeID);

    if(index == activeIndex - 1) { return "left"; }
    if(index == activeIndex + 1) { return "right"; }
    return "none";
  }
  render() {
    var position = this.position();
    if(position == "none") { return <div />; }

    var type = this.props.type.personality_type;
    var color = `#${type.badge.color_1}`;
    var name = type.description.split("'")[1];
    var description = type.description.split("'").splice(2).join("'");

    return (
      <li class={`${style.slide} ${style[position]}`} style={`background: ${Color.rgba(color, 8.5)};`}>
        <span class={style.title} style={`color: ${color}`}>{name}</span>
        {description}
      </li>
    );
  }
}
