import Component from "components/traitify-component";
import Color from "lib/color-helpers";
import style from "./style";

export default class PersonalityBadge extends Component{
  render(){
    const color = `#${this.props.type.badge.color_1}`;

    return (
      <div class={style.image} style={`border: 3px solid ${color}; background: ${Color.rgba(color, 8.5)};`}>
        <img alt="" role="presentation" ariahidden="true" src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}
