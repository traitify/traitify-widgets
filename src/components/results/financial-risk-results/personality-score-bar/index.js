import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityScoreBar extends Component {
  static propTypes = {
    assessment: PropTypes.shape({overall_score: PropTypes.number}),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  static defaultProps = {assessment: null}
  componentDidMount() {
    this.props.ui.trigger("PersonalityScoreBar.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityScoreBar.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const score = this.props.assessment.overall_score;

    return (
      <div className={style.scoreBar}>
        <h1>Financial Risk Score: <span>{score}</span></h1>
        <div className={style.scoreBarBar}>
          <div className={style.scoreBarLegend}>
            <div className={style.scoreBarLegendLow}>0</div>
            <div className={style.scoreBarLegendHigh}>100</div>
          </div>
          <div className={style.scoreBarRange}>
            <div className={style.scoreBarLow}> </div>
            <div className={style.scoreBarLowMed}> </div>
            <div className={style.scoreBarMed}> </div>
            <div className={style.scoreBarMedHigh}> </div>
            <div className={style.scoreBarHigh}> </div>
          </div>
          <div className={style.scoreBarIndicators}>
            <div className={style.scoreBarIndicatorLow}> </div>
            <div className={style.scoreBarIndicator} style={{marginLeft: `${score}%`}}> </div>
            <div className={style.scoreBarIndicatorHigh}> </div>
          </div>
        </div>
      </div>
    );
  }
}

export {PersonalityScoreBar as Component};
export default withTraitify(PersonalityScoreBar);
