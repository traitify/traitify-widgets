import { h, Component } from "preact";
import style from "./style";
import Chart from "canvas-radar";

export default class Radar extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.destroyChart = this.destroyChart.bind(this);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  componentDidMount() {
    let com = this;
    window.addEventListener("resize", this.updateDimensions);

    let count = 0;
    this.types().forEach((pt)=>{
      let image = new Image();
      image.src = pt.personality_type.badge.image_small;
      image.onload = function(){
        count = count + 1;
        if (count == com.types().length){
          com.createChart();
          com.updateDimensions();
        }
      };
    });

    this.props.triggerCallback("radar", "initialized", this);
  }
  componentDidUpdate() {
    this.updateChart();
  }
  updateDimensions() {
    let width = (this.canvasContainer || {}).clientWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.setState({ width });
  }
  types (){
    return this.props.assessment.personality_types;
  }
  createChart() {
    let data = {
      labels: [],
      labelImages: [],
      datasets: [{
        data: [],
        fill: false,
        borderColor: "#42b0db",
        pointBackgroundColor: "#42b0db",
        pointBorderColor: "#42b0db"
      }]
    };
    this.types().forEach((type)=>{
      data.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      data.datasets[0].data.push(type.score);
    });

    let max = this.props.assessment.personality_types[0].score > 10 ? 100 : 10;
    let options = {
      legend: { display: false },
      responsive: false,
      scale: {
        ticks: {
          fontSize: 10,
          min: 0,
          max,
          showLabelBackdrop: false,
          stepSize: max / 2
        },
        pointLabels: { fontSize: 16 }
      },
      tooltips: { enabled: false }
    };

    var ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, data);
  }
  updateChart() {
    if (!this.chart) return this.createChart();
    this.chart.resize();
  }
  destroyChart() {
    if (!this.chart) return;
    this.chart.destroy();
    delete this.chart;
  }
  render() {
    return (
      <div class={style.radar}>
        <div class={style.radarContainer}  ref={(canvasContainer) => { this.canvasContainer = canvasContainer; }}>
          <canvas ref={(canvas) => { this.canvas = canvas; }} width="810" height="700" />
        </div>
      </div>
    );
  }
}
