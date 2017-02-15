import { h, Component } from "preact";
import style from "./style";

import PersonalityTypes from "../personality-types";

export default class PersonalityTypeBar extends Component {
  render() {
    var type = this.props.type.personality_type;
    var color = `#${type.badge.color_1}`;
    var score = Math.round(this.props.type.score);
    var width = 1 / this.props.length * 100;
    var left = 100 / this.props.length * this.props.index;
    return (
      <div class={style.bar} style={`background: ${color}; height: ${score}%; width: ${width}%; left: ${left}%;`}>
        <span class={style.text}>{score}%</span>
      </div>
    );
  }
}
