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

    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    const takeaways = personality.details.filter(({title}) => (title === "Takeaways")).map(({body}) => body);
    if(takeaways.length === 0) { return null; }

    return (
      <div className={style.takeaways}>
        <h2>Key Takeaways of {personality.name} Financial Risk Style</h2>
        <ul>
          {takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export {PersonalityTakeaways as Component};
export default withTraitify(PersonalityTakeaways);
