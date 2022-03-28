import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityType from "../personality-type";
import style from "./style.scss";

class PersonalityTypes extends Component {
  static defaultProps = {assessment: null};
  static propTypes = {
    assessment: PropTypes.shape({
      personality_types: PropTypes.arrayOf(
        PropTypes.shape({
          personality_type: PropTypes.shape({
            id: PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      )
    }),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityTypes.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTypes.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <ul className={style.types}>
        {this.props.assessment.personality_types.map((type) => (
          <PersonalityType key={type.personality_type.id} type={type} {...this.props} />
        ))}
      </ul>
    );
  }
}

export {PersonalityTypes as Component};
export default withTraitify(PersonalityTypes);
