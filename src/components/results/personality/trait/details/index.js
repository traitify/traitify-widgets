import PropTypes from "prop-types";
import {Component} from "react";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityTraitDetails extends Component {
  static propTypes = {
    trait: PropTypes.shape({
      personality_trait: PropTypes.object.isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTrait.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTrait.updated", this);
  }
  render() {
    const trait = this.props.trait.personality_trait;
    const type = trait.personality_type;
    const color = `#${type.badge.color_1}`;

    return (
      <div className={style.trait} style={{background: rgba(color, 8.5)}}>
        <div className={style.bar} style={{width: "100%", background: color}} />
        <div className={style.content}>
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

export {PersonalityTraitDetails as Component};
export default withTraitify(PersonalityTraitDetails);
