import {h, Component} from "preact";
import Color from "color-helpers";
import style from "./style";

export default class PersonalityBadge extends Component{
  render(){
    let color = `#${this.props.type.badge.color_1}`;
    return (
      <div class={style.image} style={`border: 3px solid #${color}; background: ${Color.rgba(color, 8.5)};`}>
        <img alt={this.props.type.name} src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}
