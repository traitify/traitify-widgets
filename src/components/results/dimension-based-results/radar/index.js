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
    let com = this;
    window.addEventListener("resize", this.updateChart);

    let count = 0;
    this.types().forEach((pt)=>{
      let image = new Image();
      image.src = pt.personality_type.badge.image_small;
      image.onload = function(){
        count = count + 1;
        if(count === com.types().length){
          com.updateChart();
        }
      };
    });

    this.props.triggerCallback("Radar", "initialized", this);
  }
  componentDidUpdate(){
    this.updateChart();
  }
  types(){
    return this.props.assessment.personality_types;
  }
  createChart(){
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

    let ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, data);
    this.chart.resize();
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
