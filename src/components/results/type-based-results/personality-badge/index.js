import { h, Component } from "preact";
import style from "./style";

export default class PersonalityBadge extends Component {
  render() {
    var color = this.props.type.badge.color_1;
    return (
      <div class={style.image} style={`border: 3px solid #${color};`}>
        <img alt={this.props.type.name} src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}
