import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityBadge from "../personality-badge";
import style from "./style.scss";

class PersonalityType extends Component {
  static defaultProps = {assessment: null};
  static propTypes = {
    assessment: PropTypes.shape({
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
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityType.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityType.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const type = this.props.assessment.personality_types[0].personality_type;

    return (
      <div className={style.type}>
        <PersonalityBadge type={type} {...this.props} />
        <h3 className={style.name}>{type.name}</h3>
        <p className={style.description}>{type.description}</p>
      </div>
    );
  }
}

export {PersonalityType as Component};
export default withTraitify(PersonalityType);
