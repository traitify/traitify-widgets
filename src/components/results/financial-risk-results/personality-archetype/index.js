import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityArchetype extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
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

    // const personality = this.props.assessment.archetype || {};

    return (
      <div className={style.archetype}>
        <div className={style.archetypeStyle}>
          <img src="//placehold.it/80x80" alt="INSERT Archetype Name" />
          <h2>Your Financial Risk style is <span>Neutral</span></h2>
          <p>Your assessment results show that your Financial Risk Style is Neutral.</p>
        </div>
        <div className={style.archetypeMeaning}>
          <h2>What does this tell me?</h2>
          <p>Your financial risk style is influenced by your life circumstances.</p>
        </div>
      </div>
    );
  }
}

export {PersonalityArchetype as Component};
export default withTraitify(PersonalityArchetype);
