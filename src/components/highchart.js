import PropTypes from "prop-types";
import {Component} from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";

HighchartsMore(Highcharts);

export default class Highchart extends Component {
  static propTypes = {
    chart: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
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
    })
  };
  static defaultProps = {
    legend: null,
    xAxis: null,
    title: null,
    type: null
  };
  constructor(props) {
    super(props);

    this.state = {
      config: {}
    };
  }
  componentDidMount() {
    this.afterRender();
  }
  setConfig() {
    return {
      chart: {
        type: this.props.type,
        backgroundColor: "white"
      },
      title: {text: this.props.title},
      xAxis: {title: {text: ""}, crosshair: true},
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      credits: {enabled: false},
      exporting: {enabled: false},
      legend: {},
      series: this.props.series
    };
  }
  afterRender() {
    this.config = this.setConfig();
    Object.assign(this.config.chart, this.props.chart);
    Object.assign(this.config.legend, this.props.legend);
    Object.assign(this.config.xAxis, this.props.xAxis);
    this.configForTooltip();
    this.setState({config: this.config});
  }
  configForTooltip() {
    this.config.tooltip = {
      headerFormat: "<span style=\"font-size:10px\">{point.key}</span><table>",
      pointFormat: "<tr><td style=\"color:{series.color};padding:0\">{series.name}: </td>"
        + "<td style=\"padding:0\"><b>{point.y:.0f}</b></td></tr>",
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    };
  }
  render() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={this.state.config}
      />
    );
  }
}
