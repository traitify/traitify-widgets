import PropTypes from "prop-types";
import {Component} from "react";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityTrait extends Component {
  static propTypes = {
    trait: PropTypes.shape({
      personality_trait: PropTypes.shape({
        definition: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        personality_type: PropTypes.shape({
          badge: PropTypes.shape({
            color_1: PropTypes.string.isRequired,
            image_medium: PropTypes.string.isRequired
          }).isRequired,
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      score: PropTypes.number.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityTrait.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTrait.updated", this);
  }
  render() {
    const trait = this.props.trait.personality_trait;
    const score = Math.round(this.props.trait.score / 2 + 50);
    const type = trait.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <div className={style.trait} style={{background: rgba(color, 8.5)}}>
        <div className={style.bar} style={{width: `${score}%`, background: color}} />
        <div className={style.content}>
          <div className={style.score}>{score}%</div>
          <img src={type.badge.image_medium} alt={type.name} className={style.icon} />
          <h3 className={style.name}>
            {trait.name}
            <span className={style.description}>{trait.definition}</span>
          </h3>
        </div>
      </div>
    );
  }
}

export {PersonalityTrait as Component};
export default withTraitify(PersonalityTrait);
