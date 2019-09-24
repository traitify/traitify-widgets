import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityDimension from "../personality-dimension";
import style from "./style";

class PersonalityDimensions extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensions.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensions.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <ul className={style.dimensions}>
        {this.props.assessment.personality_types.map((type) => (
          <PersonalityDimension key={type.personality_type.id} type={type} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {PersonalityDimensions as Component};
export default withTraitify(PersonalityDimensions);
