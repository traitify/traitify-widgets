import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style.scss";

class PersonalityBlend extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      personality_blend: PropTypes.shape({
        description: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        personality_type_1: PropTypes.shape({
          badge: PropTypes.shape({
            color_1: PropTypes.string.isRequired,
            image_medium: PropTypes.string.isRequired
          }).isRequired
        }),
        personality_type_2: PropTypes.shape({
          badge: PropTypes.shape({
            color_1: PropTypes.string.isRequired,
            image_medium: PropTypes.string.isRequired
          }).isRequired
        })
      })
    }),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityBlend.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityBlend.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const blend = this.props.assessment.personality_blend;
    if(!blend) { return null; }

    return (
      <div className={style.blend}>
        <PersonalityBadge type={blend.personality_type_1} {...this.props} />
        <PersonalityBadge type={blend.personality_type_2} {...this.props} />
        <h3 className={style.name}>{blend.name}</h3>
        <p className={style.description}>{blend.description}</p>
      </div>
    );
  }
}

export {PersonalityBlend as Component};
export default withTraitify(PersonalityBlend);
