import { h, Component } from "preact";
import style from "./style";

export default class PersonalityBadge extends Component {
	convertHex(hex,opacity) {
		hex = hex.replace('#','');
		var r = parseInt(hex.substring(0,2), 16);
		var g = parseInt(hex.substring(2,4), 16);
		var b = parseInt(hex.substring(4,6), 16);
		var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		return result;
	}

  render() {
    var color = this.props.type.badge.color_1;
    return (
      <div class={style.image} style={`border: 3px solid #${color}; background: ${this.convertHex(color,8.5)};`}>
        <img alt={this.props.type.name} src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}
