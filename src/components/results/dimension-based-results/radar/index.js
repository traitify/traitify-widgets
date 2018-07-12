import Component from "components/traitify-component";
import style from "./style";
import Chart from "lib/canvas-radar-chart";

export default class Radar extends Component{
  componentDidMount(){
    window.addEventListener("resize", this.updateChart);

    this.traitify.ui.trigger("Radar.initialized", this);
    this.updateChart();
    this.followAssessment();
  }
  componentDidUpdate(){
    this.updateChart();
    this.followAssessment();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.updateChart);
  }
  createChart = ()=>{
    if(!this.isReady("results")){ return; }

    let options = {
      labels: [],
      data: [{
        fill: true,
        values: []
      }]
    };

    const types = this.state.assessment.personality_types;
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
  }
  updateChart = ()=>{
    if(!this.chart) return this.createChart();

    this.chart.resize();
  }
  destroyChart = ()=>{
    if(!this.chart) return;

    this.chart.destroy();
    delete this.chart;
  }
  render(){
    if(!this.isReady("results")){ return; }

    return (
      <div class={style.radar}>
        <div class={style.radarContainer}>
          <canvas ref={(canvas)=>{ this.canvas = canvas; }} width="820" height="700" aria-label="A chart displaying your results. See text version below" />
        </div>
      </div>
    );
  }
}
