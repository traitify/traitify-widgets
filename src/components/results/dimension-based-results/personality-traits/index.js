import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityTrait from "../personality-trait";
import style from "./style.scss";

class PersonalityTraits extends Component {
  static propTypes = {
    assessment: PropTypes.shape({personality_traits: PropTypes.array}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  static defaultProps = {assessment: null}
  componentDidMount() {
    this.props.ui.trigger("PersonalityTraits.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTraits.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const perspective = this.props.getOption("perspective") || "firstPerson";
    const thirdPersonCheck = perspective === "thirdPerson";
    const traits = this.props.assessment.personality_traits;

    return (
      <div className={style.traits}>
        <h4 className={style.title}>{this.props.translate("most_represented_traits")}</h4>
        {thirdPersonCheck && (
          <div className={style.traitsDefinition}>{this.props.translate("most_represented_traits_definition")}</div>
        )}
        {traits.slice(0, 5).map((trait) => (
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
        <h4 className={style.title}>{this.props.translate("least_represented_traits")}</h4>
        {thirdPersonCheck && (
          <div className={style.traitsDefinition}>{this.props.translate("least_represented_traits_definition")}</div>
        )}
        {traits.slice(-5).map((trait) => (
          <PersonalityTrait key={trait.personality_trait.id} trait={trait} {...this.props} />
        ))}
      </div>
    );
  }
}

export {PersonalityTraits as Component};
export default withTraitify(PersonalityTraits);
