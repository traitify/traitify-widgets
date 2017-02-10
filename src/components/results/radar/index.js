import { h, Component } from "preact";
import Chart from "chart-override";
import style from "./style";

export default class Radar extends Component {
  componentDidMount() {
    var data = {
      labels: [],
      labelImages: [],
      datasets: [{
        data: [],
        fill: false,
        borderColor: "#42b0db",
        pointBackgroundColor: "#42b0db",
        pointBorderColor: "#42b0db"
      }]
    }
    this.props.assessment.personality_types.forEach(function(type) {
      data.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      data.datasets[0].data.push(type.score);
    });

    var max = this.props.assessment.personality_types[0].score > 10 ? 100 : 10;
    var stepSize = max == 10 ? 5 : 10;
    var options = {
      legend: { display: false },
      scale: {
        ticks: {
          fontSize: 10,
          min: 0,
          max: max,
          showLabelBackdrop: false,
          stepSize: stepSize
        },
        pointLabels: { fontSize: 16 }
      },
      tooltips: { enabled: false }
    }

    var ctx = this.canvas.getContext("2d");
    var chart = new Chart(ctx, { type: "radar", data: data, options: options });
  }
  render() {
    return (
      <div class={style.radar}>
        <canvas ref={(canvas) => { this.canvas = canvas; }} width="500" height="200" />
      </div>
    );
  }
}
