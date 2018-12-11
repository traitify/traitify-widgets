import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityTypeBar from "../personality-type-bar";
import style from "./style";

class PersonalityTypeBarChart extends Component {
  static defaultProps = {assessment: null, assessmentID: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    assessmentID: PropTypes.string,
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {activeType: null};
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityTypeBarChart.initialized", this);
    this.props.ui.on("Assessment.activeType", this.getActiveType);
    this.activate();
  }
  componentDidUpdate(prevProps) {
    this.props.ui.trigger("PersonalityTypeBarChart.updated", this);

    if(this.props.assessmentID !== prevProps.assessmentID) {
      this.props.ui.trigger("Assessment.activeType", this, null);
    }

    this.activate();
  }
  componentWillUnmount() {
    this.props.ui.off("Assessment.activeType", this.getActiveType);
  }
  getActiveType = () => {
    this.setState({activeType: this.props.ui.current["Assessment.activeType"]});
  }
  activate() {
    if(!this.props.isReady("results")) { return; }
    if(this.state.activeType) { return; }

    const activeType = this.props.ui.current["Assessment.activeType"];
    if(activeType) {
      this.setState({activeType});
    } else {
      const type = this.props.assessment.personality_types[0];

      this.props.ui.trigger("Assessment.activeType", this, type);
    }
  }
  barHeight(type) {
    const maxScore = this.props.assessment.personality_types[0].score;
    const score = (100 - (maxScore - type.score)) - 5;

    return score > 0 ? score : 0;
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <div className={style.chart}>
        {this.props.assessment.personality_types.map((type) => (
          <PersonalityTypeBar
            key={type.personality_type.id}
            type={type}
            barHeight={this.barHeight(type)}
            {...this.props}
          />
        ))}
      </div>
    );
  }
}

export {PersonalityTypeBarChart as Component};
export default withTraitify(PersonalityTypeBarChart);
