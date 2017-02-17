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

	render() {
		var type = this.props.type.personality_type;
		var typeTitle = `${type.name}`;
		var typeIcon = `${type.badge.image_medium}`;
		var color = `#${type.badge.color_1}`;
		var score = Math.round(this.props.type.score);
		var spanStyle = ''

		if(type.hover || type.clicked){
			spanStyle = `background-color: ${color}`;
		}
		return (
			<li class={`${style.bar} ${type.clicked == true ? style.selected :'' }`} onMouseOver={this.handleColor.bind(this, 'hover', true)} onMouseOver={this.handleColor.bind(this, 'hover', false)} onClick={this.handleColor.bind(this, 'clicked', true)}>
        <span class={style.barScore} style={`background: ${color}; height: ${score}%;`}>{score}%</span>
        <span class={style.barLabel} style={spanStyle}><img src={`${typeIcon}`} alt={`${typeTitle}`} /><i>{typeTitle}</i></span>
			</li>
		);
	}
}