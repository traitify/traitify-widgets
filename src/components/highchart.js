import PropTypes from "prop-types";
import {Component} from "react";
import HighCharts from "highcharts";
import HighChartsReact from "highcharts-react-official";

export default class HighChart extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    chart: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
    donut: PropTypes.number,
    legend: PropTypes.shape({
      layout: PropTypes.string
    }),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            y: PropTypes.number
          })
        )
      })
    ).isRequired,
    title: PropTypes.string,
    type: PropTypes.string,
    xAxis: PropTypes.shape({
      title: PropTypes.string
    }),
    yAxis: PropTypes.shape({
      title: PropTypes.string
    })
  }
  static defaultProps = {
    backgroundColor: null,
    donut: null,
    legend: null,
    yAxis: null,
    xAxis: null,
    title: null,
    type: null
  }
  constructor(props) {
    super(props);

    this.state = {
      config: {}
    };
  }
  componentDidMount() {
    this.afterRender();
  }
  afterRender() {
    this.config = this.setConfig();
    if(this.props.type === "radar") {
      this.configForRadar();
    } else if(this.props.type === "pie") {
      this.configForPie();
    }
    if(this.props.chart) { this.configForChart(); }
    if(this.props.xAxis) { this.configForX(); }
    if(this.props.yAxis) { this.configForY(); }
    this.configForLegend();
    this.configForTooltip();
    this.setState({config: this.config});
  }
  setConfig() {
    return {
      chart: {
        type: this.props.type,
        backgroundColor: this.props.backgroundColor
      },
      title: {text: this.props.title},
      xAxis: {title: {text: ""}, crosshair: true},
      yAxis: {title: {text: ""}},
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      credits: {enabled: false},
      exporting: {enabled: false},
      legend: {enabled: false},
      series: this.props.series
    };
  }
  configForRadar() {
    this.config.chart.type = "area";
    this.config.chart.polar = true;
  }
  configForPie() {
    this.config.chart = {
      type: "pie",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      height: 270,
      spacing: [0, 10, 10, 0]
    };
    this.config.plotOptions.pie = {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        distance: -30,
        format: "<b>{point.percentage:.0f}%</b>",
        style: {
          color: (HighCharts.theme && HighCharts.theme.contrastTextColor) || "white",
          textShadow: "0 0 4px #000000"
        }
      }
    };
    if(this.props.donut) { this.config.series[0].innerSize = `${100 - this.props.donut}%`; }
    this.config.series[0].colorByPoint = true;
  }
  configForX() {
    Object.assign(this.config.xAxis, this.props.xAxis);
  }
  configForY() {
    Object.assign(this.config.yAxis, this.props.yAxis);
  }
  configForChart() {
    Object.assign(this.config.chart, this.props.chart);
  }
  configForLegend() {
    if(this.props.legend instanceof Object) { this.config.legend = this.props.legend; }
  }
  configForTooltip() {
    this.config.tooltip = {};
    if(this.config.series[0].name) {
      this.config.tooltip = {
        headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
        pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>"
          + "<td style=\"padding:0\"><b>{point.y:.0f}</b></td></tr>",
        footerFormat: "</table>",
        shared: true,
        useHTML: true
      };
    } else {
      this.config.tooltip.formatter = function() {
        let text = "";
        if(this.point.color) { text += `<span style="color:${this.point.color}">`; }
        text += this.point.name || this.point.category;
        if(this.point.color) { text += "</span>"; }
        text += `: ${this.point.y}`;
        if(this.point.description) { text += ` <br/> ${this.point.description}`; }
        return text;
      };
    }
  }
  render() {
    return (
      <HighChartsReact
        highcharts={HighCharts}
        options={this.state.config}
      />
    );
  }
}
