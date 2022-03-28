import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityDetails extends Component {
  static defaultProps = {assessment: null};
  static propTypes = {
    assessment: PropTypes.shape({
      personality_blend: PropTypes.shape({
        details: PropTypes.arrayOf(
          PropTypes.shape({
            body: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired
          }).isRequired
        ),
        environments: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired
          }).isRequired
        )
      }),
      personality_types: PropTypes.arrayOf(
        PropTypes.shape({
          personality_type: PropTypes.shape({
            details: PropTypes.arrayOf(
              PropTypes.shape({
                body: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired
              }).isRequired
            ),
            environments: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired
              }).isRequired
            )
          }).isRequired
        }).isRequired
      ).isRequired
    }),
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDetails.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    let personality = this.props.assessment.personality_blend;
    personality = personality || this.props.assessment.personality_types[0].personality_type;

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
