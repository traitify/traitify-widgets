import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityArchetype extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityArchetype.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityArchetype.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }
    const badge = personality.details.find(({title}) => title === "Badge").body;
    const perspective = this.props.getOption("perspective");
    const options = {base: personality, perspective};
    const pronoun = perspective === "thirdPerson" ? "Their" : "Your";

    return (
      <div className={style.archetype}>
        <div className={style.archetypeStyle}>
          <img alt={personality.name} src={badge} />
          <h2>{pronoun} Financial Risk style is <span>{personality.name}</span></h2>
          <p>{detailWithPerspective({...options, name: "Description"})}</p>
        </div>
        <div className={style.archetypeMeaning}>
          <h2>What does this tell me?</h2>
          <p>{detailWithPerspective({...options, name: "Analysis"})}</p>
        </div>
      </div>
    );
  }
}

export {PersonalityArchetype as Component};
export default withTraitify(PersonalityArchetype);
