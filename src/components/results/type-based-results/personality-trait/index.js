import { h, Component } from "preact";
import style from "./style";

export default class PersonalityTrait extends Component {
	convertHex(hex,opacity) {
		hex = hex.replace('#','');
		var r = parseInt(hex.substring(0,2), 16);
		var g = parseInt(hex.substring(2,4), 16);
		var b = parseInt(hex.substring(4,6), 16);
		var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		return result;
	}
  render() {
    var trait = this.props.trait.personality_trait;
    var score = Math.round(this.props.trait.score);
    var type = trait.personality_type;
    var color = `#${type.badge.color_1}`;
    return (
      <div class={style.trait} style={`border: 3px solid #${color}; background: ${this.convertHex(color,8.5)};`}>
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
