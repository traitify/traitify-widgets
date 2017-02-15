import { h, Component } from "preact";
import style from "./style";

import Color from "color";

export default class PersonalityTrait extends Component {
  render() {
    var trait = this.props.trait.personality_trait;
    var score = Math.round(this.props.trait.score);
    var type = trait.personality_type;
    var color = `#${type.badge.color_1}`;
    var background = Color(color);
    // May need to play with this so it works for all colors
    // Can use things like `if background.light() then lighten more/less`
    background = background.lighten(0.5).hex();
    return (
      <div class={style.trait} style={`background: ${background};`}>
        <div class={style.bar} style={`width: ${score}%; background: ${color};`} />
        <div class={style.content}>
          <div class={style.score}>{score}%</div>
          <img src={type.badge.image_medium} alt={type.name} class={style.icon} />
          <h3 class={style.name}>
            {trait.name}
            <span class={style.description}>{trait.definition}</span>
          </h3>
        </div>
      </div>
    );
  }
}
