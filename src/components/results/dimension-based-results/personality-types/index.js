import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import PersonalityType from "../personality-type";
import style from "./style";

class Types extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("PersonalityTypes.initialized", this);
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("PersonalityTypes.updated", this);
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

export {Types as Component};
export default withTraitify(Types);
