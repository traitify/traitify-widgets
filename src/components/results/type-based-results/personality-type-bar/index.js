import { h, Component } from "preact";
import style from "./style";

import PersonalityTypes from "../personality-types";

export default class PersonalityTypeBar extends Component {
  render() {
    var type = this.props.type.personality_type;
		var typeTitle = `${type.name}`;
		var typeIcon = `${type.badge.image_medium}`;
    var color = `#${type.badge.color_1}`;
    var score = Math.round(this.props.type.score);
    return (
      <li class={style.bar} data-bg={`${color}`}>
        <span class={style.barScore} style={`background: ${color}; height: ${score}%;`}>{score}%</span>
				<span class={style.barLabel}><img src={`${typeIcon}`} alt={`${typeTitle}`} /><i>{typeTitle}</i></span>
      </li>
    );
  }
}
