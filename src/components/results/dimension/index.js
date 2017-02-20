import { h, Component } from "preact";
import style from "./style";

export default class Dimension extends Component {
  constructor(props) {
    super(props);
    this.state = {showContent: props.index == 0}
  }
  trigger(context, e) {
    e.preventDefault();
    context.setState({showContent: !context.state.showContent});
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
    var type = this.props.personalityType.personality_type;
    var benefits = [];
    var pitfalls = [];
    type.details.forEach(function(detail) {
      if(detail.title == "Benefits") benefits.push(detail.body)
      if(detail.title == "Pitfalls") pitfalls.push(detail.body)
    });
    var color = `#${type.badge.color_1}`;
    var color2 = `#${type.badge.color_2}`;
    return (
      <li class={style.dimension} style={`border-top: 3px solid ${color};`}>
        <div class={style.main} style={`background: ${this.convertHex(color,8.5)};`}>
          <a class={style.trigger} style={`color: ${color};`} onClick={this.trigger.bind(null, this)} href="#">{this.props.translate(this.state.showContent ? "show_less" : "show_more")}</a>
          <div class={style.side}>
            <p class={style.icon}>
              <img src={type.badge.image_medium} alt={type.name} />
            </p>
            <p class={style.score}>{this.props.personalityType.score} - {type.level}</p>
          </div>
          <div class={style.content}>
            <h4 class={style.title}>{type.name}</h4>
            <p class={style.description}>{type.description}</p>
						<p class={style.center}><a class={style.lowerTrigger} style={`background: ${this.convertHex(color,30)}`} onClick={this.trigger.bind(null, this)} href="#">{this.props.translate(this.state.showContent ? "show_less" : "show_more")}</a></p>
          </div>
        </div>
        {this.state.showContent &&
          <div class={style.details}>
            <div class={style.content} style={`background: ${this.convertHex(color,30)}`}>
              <div class={style.detail}>
                <h5 class={style.benefits}>{this.props.translate("potential_benefits")}</h5>
                <ul>
                  {benefits.map(function(benefit) {
                    return <li>{benefit}</li>
                  })}
                </ul>
              </div>
              <div class={style.detail}>
                <h5 class={style.pitfalls}>{this.props.translate("potential_pitfalls")}</h5>
                <ul>
                  {pitfalls.map(function(pitfall) {
                    return <li>{pitfall}</li>
                  })}
                </ul>
              </div>
            </div>
          </div>
        }
      </li>
    );
  }
}
