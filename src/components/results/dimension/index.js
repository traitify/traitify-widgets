import { h, Component } from "preact";
import Color from "color";
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
  render() {
    var type = this.props.personalityType.personality_type;
    var color = `#${type.badge.color_1}`;
    var benefits = [];
    var pitfalls = [];
    type.details.forEach(function(detail) {
      if(detail.title == "Benefits") benefits.push(detail.body)
      if(detail.title == "Pitfalls") pitfalls.push(detail.body)
    });
    return (
      <li class={style.dimension}>
        <div class={style.content} style={`background: ${color}`}>
          <a class={style.trigger} onClick={this.trigger.bind(null, this)} href="#">{this.props.translate(this.state.showContent ? "show_less" : "show_more")}</a>
          <p class={style.icon}>
            <img src={type.badge.image_medium} alt={type.name} />
          </p>
          <p class={style.score}>{this.props.personalityType.score} - {type.level}</p>
          <h4 class={style.title}>{type.name}</h4>
          <p class={style.description}>{type.description}</p>
        </div>
        {this.state.showContent &&
          <div class={style.details}>
            <div class={style.content} style={`background: ${Color(color).darken(0.2).hex()}`}>
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
