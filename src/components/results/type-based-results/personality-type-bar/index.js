import { h, Component } from "preact";
import style from "./style";

import PersonalityTypes from "../personality-types";

export default class PersonalityTypeBar extends Component {
	constructor(){
		super()
		this.state = {}
		return this
	}

  handleColor(key, value) {
		let index = this.props.index
    let props = this.props.assessment.personality_types.map((type, i) => {
      type.personality_type[key] = i == index ? true : false;
      return type
    })
    this.props.setState(props);
	}

	convertHex(hex,opacity) {
		hex = hex.replace('#','');
		var r = parseInt(hex.substring(0,2), 16);
		var g = parseInt(hex.substring(2,4), 16);
		var b = parseInt(hex.substring(4,6), 16);
		var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		return result;
	}

	render() {
		var type = this.props.type.personality_type;
		var typeTitle = `${type.name}`;
		var typeIcon = `${type.badge.image_medium}`;
		var color = `#${type.badge.color_1}`;
		var score = Math.round(this.props.type.score);
		var spanStyle = ''

		if(type.hover || type.clicked){
			spanStyle = `background-color: ${this.convertHex(color,8.5)};`;
		}
		return (
			<li class={`${style.bar} ${type.clicked == true ? style.selected :'' }`} onMouseOver={this.handleColor.bind(this, 'hover', true)} onMouseOver={this.handleColor.bind(this, 'hover', false)} onClick={this.handleColor.bind(this, 'clicked', true)}>
        <span class={style.barScore} style={`background: ${color}; height: ${score}%;`}>{score}%</span>
        <span class={style.barLabel} style={spanStyle}><img src={`${typeIcon}`} alt={`${typeTitle}`} /><i>{typeTitle}</i></span>
			</li>
		);
	}
}