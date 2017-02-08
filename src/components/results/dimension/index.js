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
    var dimension = this.props.dimension;
    return (
      <li class={style.dimension} style={`background: ${dimension.color}`}>
        <a class={style.trigger} onClick={this.trigger.bind(null, this)} href="#">{this.props.translate(this.state.showContent ? "show_less" : "show_more")} &nbsp;-</a>
        <p class={style.icon}>
          <img src={dimension.icon} alt={dimension.name} />
        </p>
        <p class={style.score}>{dimension.score}</p>
        <h4 class={style.title}>
          {dimension.name} <img src="https://cdn.traitify.com/assets/images/info-circle.png" alt={dimension.name} title={dimension.name} />
        </h4>
        <p class={style.description}>{dimension.description}</p>
        {this.state.showContent &&
          <div class={style.content} style={`background: ${Color(dimension.color).darken(0.2).hex()}`}>
            <div class={style.detail}>
              <h5 class={style.benefits}>{this.props.translate("potential_benefits")}</h5>
              <ul>
                {dimension.benefits.map(function(benefit) {
                  return <li>{benefit}</li>
                })}
              </ul>
            </div>
            <div class={style.detail}>
              <h5 class={style.pitfalls}>{this.props.translate("potential_pitfalls")}</h5>
              <ul>
                {dimension.pitfalls.map(function(pitfall) {
                  return <li>{pitfall}</li>
                })}
              </ul>
            </div>
          </div>
        }
      </li>
    );
  }
}
