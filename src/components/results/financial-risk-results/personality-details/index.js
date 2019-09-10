import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDetails extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDetails.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    // const personality = this.props.assessment.archetype || {};

    return (
      <div className={style.details}>
        <div className={style.detailsLife}>
          <h2>The Neutral Financial Risk Style in everyday life:</h2>
          <p>You are unenthused by a lack of change in life and thrive with unpredictability.</p>
        </div>
        <div className={style.detailsFinancial}>
          <h2>The Neutral Financial Risk Style in financial decisions:</h2>
          <p>You are unenthused by a lack of change in life and thrive with unpredictability.</p>
        </div>
      </div>
    );
  }
}

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
