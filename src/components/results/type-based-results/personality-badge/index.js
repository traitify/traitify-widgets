import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style";

class PersonalityBadge extends Component{
  componentDidMount(){
    this.props.traitify.ui.trigger("PersonalityTrait.initialized", this);
  }
  componentDidUpdate(){
    this.props.traitify.ui.trigger("PersonalityTrait.updated", this);
  }
  render(){
    const color = `#${this.props.type.badge.color_1}`;

    return (
      <div class={style.image} style={`border: 3px solid ${color}; background: ${rgba(color, 8.5)};`}>
        <img alt={this.props.translate("badge")} role="presentation" ariahidden="true" src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}

export {PersonalityBadge as Component};
export default withTraitify(PersonalityBadge);
