import { h, Component } from "preact";
import style from "./style";

import PersonalityTypes from "../personality-types";

export default class PersonalityTypeSlide extends Component {
	convertHex(hex,opacity) {
		hex = hex.replace('#','');
		var r = parseInt(hex.substring(0,2), 16);
		var g = parseInt(hex.substring(2,4), 16);
		var b = parseInt(hex.substring(4,6), 16);
		var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		return result;
	}
	highlightType(desc) {
		var typeName = desc.replace(/'([^']+)'/, '<span class="slideTitle">$1</span>');
		return typeName;
	}
  render() {
		var type = this.props.type.personality_type;
		var typeTitle = `${type.name}`;
		var typeDescription = `${type.description}`;
		var color = `#${type.badge.color_1}`;

		return (
			<li class={style.slide} style={`background: ${this.convertHex(color,8.5)};`}>
				{this.highlightType(typeDescription)}
			</li>
		);
	}
}
