import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityScoreBar extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({overall_score: PropTypes.number}),
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

    const score = this.props.assessment.overall_score;

    return (
      <div className={style.scoreBar}>
        Score Bar {score}
      </div>
    );
  }
}

export {PersonalityScoreBar as Component};
export default withTraitify(PersonalityScoreBar);
