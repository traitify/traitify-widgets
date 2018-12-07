import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import Chart from "lib/helpers/canvas-radar-chart";
import style from "./style";

const dataMapper = (assessment) => {
  if(!assessment || !assessment.personality_types) { return null; }

  return JSON.stringify(assessment.personality_types.map((type) => [
    type.score,
    type.personality_type.name,
    type.personality_type.badge.image_small
  ]));
};
const dataChanged = (newAssessment, oldAssessment) => (
  dataMapper(newAssessment) !== dataMapper(oldAssessment)
);

class Radar extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired,
    translate: PropTypes.func.isRequired
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateChart);

    this.props.traitify.ui.trigger("Radar.initialized", this);
    this.updateChart();
  }
  componentDidUpdate(prevProps) {
    this.props.traitify.ui.trigger("Radar.updated", this);

    if(dataChanged(this.props.assessment, prevProps.assessment)) { this.destroyChart(); }

    this.updateChart();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateChart);
  }
  createChart = () => {
    if(!this.props.isReady("results")) { return; }

    const options = {
      labels: [],
      data: [{
        fill: true,
        values: []
      }]
    };

    const types = this.props.assessment.personality_types;
    types.forEach((type) => {
      options.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      options.data[0].values.push(type.score);
    });

    const ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, options);
    this.chart.render();
  }
  destroyChart = () => {
    if(!this.chart) { return; }

    this.chart.destroy();
    this.chart = null;
  }
  updateChart = () => {
    if(!this.chart) { return this.createChart(); }

    this.chart.resize();
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <div className={style.radar}>
        <div className={style.radarContainer}>
          <canvas ref={(canvas) => { this.canvas = canvas; }} width="820" height="700" aria-label={this.props.translate("radar_chart_label")} />
        </div>
      </div>
    );
  }
}

export {Radar as Component};
export default withTraitify(Radar);
