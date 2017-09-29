import {h, Component} from "preact";
import style from "./style";
import Chart from "canvas-radar-chart";

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

    let options = {
      labels: [],
      data: [{values: []}]
    };

    let types = this.props.assessment.personality_types;
    types.forEach((type)=>{
      options.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      options.data[0].values.push(type.score);
    });

    let ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, options);
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
