import {h, Component} from "preact";
import style from "./style";
import Chart from "canvas-radar";

export default class Radar extends Component{
  constructor(props){
    super(props);
    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.destroyChart = this.destroyChart.bind(this);
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.updateChart);
  }
  componentDidMount(){
    window.addEventListener("resize", this.updateChart);
    this.updateChart();
  }
  componentDidUpdate(){
    this.updateChart();
  }
  createChart(){
    if(!this.props.resultsReady()) return;

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

    let types = this.props.assessment.personality_types;
    let loading = types.length;
    types.forEach((type)=>{
      data.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      data.datasets[0].data.push(type.score);

      let image = new Image();
      image.src = type.personality_type.badge.image_small;
      image.onload = ()=>{
        loading = loading - 1;
        if(loading === 0) this.updateChart();
      };
    });

    let ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, data);
    this.chart.resize();
    this.props.triggerCallback("Radar", "initialized", this);
  }
  updateChart(){
    if(!this.chart) return this.createChart();
    this.chart.resize();
  }
  destroyChart(){
    if(!this.chart) return;
    this.chart.destroy();
    delete this.chart;
  }
  render(){
    if(!this.props.resultsReady()) return <div />;

    return (
      <div class={style.radar}>
        <div class={style.radarContainer}>
          <canvas ref={(canvas)=>{ this.canvas = canvas; }} width="820" height="700" />
        </div>
      </div>
    );
  }
}
