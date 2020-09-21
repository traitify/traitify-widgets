import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import {rgba} from "lib/helpers/color";
import style from "./style.scss";

class PersonalityBadge extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    type: PropTypes.shape({badge: PropTypes.object.isRequired}).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityBadge.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityBadge.updated", this);
  }
  render() {
    const color = `#${this.props.type.badge.color_1}`;

    return (
      <div className={style.image} style={{border: `3px solid ${color}`, background: rgba(color, 8.5)}}>
        <img alt={this.props.translate("badge")} role="presentation" ariahidden="true" src={this.props.type.badge.image_medium} />
      </div>
    );
  }
}

export {PersonalityBadge as Component};
export default withTraitify(PersonalityBadge);
