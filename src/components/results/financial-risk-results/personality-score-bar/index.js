import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityScoreBar extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      archetype: PropTypes.shape({
        details: PropTypes.arrayOf(PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }))
      }),
      overall_score: PropTypes.number
    }),
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityScoreBar.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityScoreBar.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }
    const personality = this.props.assessment.archetype;
    if(!personality) { return null; }

    const indicatorMargin = () => {
      const riskLevel = personality.details.find((detail) => detail.title === "risk_level").body;

      switch(riskLevel) {
        case "conservative":
          return "8";
        case "measured":
          return "28";
        case "neutral":
          return "48";
        case "receptive":
          return "68";
        case "aggressive":
          return "88";
        default:
          return "0";
      }
    };

    return (
      <div className={style.scoreBar}>
        <div className={style.scoreBarBar}>
          <div className={style.scoreBarRange}>
            <div className={style.scoreBarLow} />
            <div className={style.scoreBarLowMed} />
            <div className={style.scoreBarMed} />
            <div className={style.scoreBarMedHigh} />
            <div className={style.scoreBarHigh} />
          </div>
          <div className={style.scoreBarIndicators}>
            <div className={style.scoreBarIndicatorLow}> </div>
            <div className={style.scoreBarIndicator} style={{marginLeft: `${indicatorMargin()}%`}}> </div>
            <div className={style.scoreBarIndicatorHigh}> </div>
          </div>
        </div>
      </div>
    );
  }
}

export {PersonalityScoreBar as Component};
export default withTraitify(PersonalityScoreBar);
