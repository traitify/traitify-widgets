import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityBlend from "../personality-blend";
import PersonalityType from "../personality-type";

class PersonalityBase extends Component {
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
      }),
      personality_types: PropTypes.arrayOf(
        PropTypes.shape({
          personality_type: PropTypes.shape({
            description: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      )
    }),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityBase.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityBase.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return this.props.assessment.personality_blend ? (
      <PersonalityBlend {...this.props} />
    ) : (
      <PersonalityType {...this.props} />
    );
  }
}

export {PersonalityBase as Component};
export default withTraitify(PersonalityBase);
