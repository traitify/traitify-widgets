import PropTypes from "prop-types";
import {Component} from "react";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDimensionColumn extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired,
          image_medium: PropTypes.string.isRequired
        }).isRequired,
        level: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensionColumn.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensionColumn.updated", this);
  }
  render() {
    const {translate, type: {personality_type: {badge, level, name}, score}} = this.props;
    const color = `#${badge.color_1}`;
    let backgroundClass;
    switch(true) {
      case score <= 3: backgroundClass = "low"; break;
      case score <= 6: backgroundClass = "medium"; break;
      default: backgroundClass = "high";
    }
    // TODO: Mobile View

    return (
      <li className={style.container}>
        <div>
          <div className={style.icon} style={{border: `3px solid ${color}`, background: rgba(color, 8.5)}}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </div>
          <h3>{name}</h3>
          <h2>{level}</h2>
        </div>
        <div className={`${style.background} ${style[backgroundClass]}`} style={{background: rgba(color, 10)}} />
      </li>
    );
  }
}

export {PersonalityDimensionColumn as Component};
export default withTraitify(PersonalityDimensionColumn);
