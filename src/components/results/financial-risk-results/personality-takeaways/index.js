import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityTakeaways extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTakeaways.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityTakeaways.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    // const personality = this.props.assessment.archetype || {};

    return (
      <div className={style.takeaways}>
        <h2>Key Takeaways of Neutral Financial Risk Style</h2>
        <ul>
          <li>Not unusual to want to &quot;sleep on it&quot; before a decision</li>
          <li>Worry about making a financial mistake</li>
          <li>Expect mixed results</li>
          <li>Tend to second-guess themselvees</li>
          <li>Follow, but question, professional advice</li>
          <li>Want to be pleasantly surprised</li>
        </ul>
      </div>
    );
  }
}

export {PersonalityTakeaways as Component};
export default withTraitify(PersonalityTakeaways);
