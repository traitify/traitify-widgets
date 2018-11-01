import {Component} from "react";
import withTraitify from "lib/with-traitify";
import style from "./style";
import Chart from "lib/helpers/canvas-radar-chart";

class Radar extends Component{
  componentDidMount(){
    window.addEventListener("resize", this.updateChart);

    this.props.traitify.ui.trigger("Radar.initialized", this);
    this.updateChart();
  }
  componentDidUpdate(){
    this.updateChart();
    this.props.traitify.ui.trigger("Radar.updated", this);
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.updateChart);
  }
  createChart = ()=>{
    if(!this.props.isReady("results")){ return; }

    let options = {
      labels: [],
      data: [{
        fill: true,
        values: []
      }]
    };

    const types = this.props.assessment.personality_types;
    types.forEach((type)=>{
      options.labels.push({
        text: type.personality_type.name,
        image: type.personality_type.badge.image_small
      });
      options.data[0].values.push(type.score);
    });

    let ctx = this.canvas.getContext("2d");
    this.chart = new Chart(ctx, options);
    this.chart.render();
  }
  updateChart = ()=>{
    if(!this.chart){ return this.createChart(); }

    this.chart.resize();
  }
  render(){
    if(!this.props.isReady("results")){ return null; }

    return (
      <div className={style.radar}>
        <div className={style.radarContainer}>
          <canvas ref={(canvas)=>{ this.canvas = canvas; }} width="820" height="700" aria-label={this.props.translate("radar_chart_label")} />
        </div>
      </div>
    );
  }
}

export {Radar as Component};
export default withTraitify(Radar);
