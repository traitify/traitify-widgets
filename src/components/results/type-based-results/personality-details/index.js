import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDetails extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      personality_blend: PropTypes.object,
      personality_types: PropTypes.array.isRequired
    }),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("PersonalityDetails.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    let personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0];

    const {details} = personality;
    if(!details) { return null; }

    let complement = details.find((detail) => (detail.title === "Complement"));
    complement = complement && complement.body;
    let conflict = details.find((detail) => (detail.title === "Conflict"));
    conflict = conflict && conflict.body;
    const environments = personality.environments || [];

    return (
      <div className={style.details}>
        {complement && (
          <div className={style.complements}>
            <h4>{this.props.translate("complements")}</h4>
            <p>{complement}</p>
          </div>
        )}
        {conflict && (
          <div className={style.conflicts}>
            <h4>{this.props.translate("conflicts")}</h4>
            <p>{conflict}</p>
          </div>
        )}
        {environments[0] && (
          <div className={style.environments}>
            <h4>{this.props.translate("best_work_environments")}</h4>
            <ul>
              {environments.map((environment) => (
                <li key={environment.name}>{environment.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
