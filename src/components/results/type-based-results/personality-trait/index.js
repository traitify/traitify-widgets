import {h, Component} from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityTrait extends Component{
  render(){
    let trait = this.props.trait.personality_trait;
    let score = Math.round(this.props.trait.score/2 + 50);
    let type = trait.personality_type;
    let color = `#${type.badge.color_1}`;
    return (
      <div class={style.trait} style={`background: ${Color.rgba(color, 8.5)};`}>
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
