import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityBlend from "../personality-blend";
import PersonalityType from "../personality-type";

class PersonalityBase extends Component {
  static propTypes = {
    assessment: PropTypes.shape({personality_blend: PropTypes.object}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  static defaultProps = {assessment: null}
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
