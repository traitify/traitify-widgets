import PropTypes from "prop-types";
import {Component} from "react";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDimension extends Component {
  static propTypes = {
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired
        }).isRequired,
        level: PropTypes.string,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimension.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimension.updated", this);
  }
  render() {
    const {type: {personality_type: {badge, level, name}}} = this.props;
    const color = `#${badge.color_1}`;

    // TODO: Once level is added to API
    //   Mark it as required in propTypes
    //   remove `|| "Score"`
    return (
      <li className={style.dimension} style={{background: rgba(color, 10), borderTop: `3px solid ${color}`}}>
        <h2>{name} <span style={{color}}>|</span> {level || "Score"}</h2>
        <ul className={style.dimensionHigher}>
          <li style={{background: rgba(color, 50)}}>misplaces items</li>
        </ul>
      </li>
    );
  }
}

export {PersonalityDimension as Component};
export default withTraitify(PersonalityDimension);
