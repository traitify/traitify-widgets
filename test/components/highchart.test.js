import Component from "components/highchart";
import ComponentHandler from "support/component-handler";

jest.mock("highcharts", () => (() => (<div className="mock">HighCharts</div>)));
jest.mock("highcharts-react-official", () => (() => (<div className="mock">HighchartsReactOfficial</div>)));
jest.mock("highcharts/highcharts-more", () => (() => (<div className="mock">HighchartsMore</div>)));

describe("HighChart", () => {
  let props;

  beforeEach(() => {
    props = {
      chart: {marginRight: 50, marginLeft: 50},
      legend: {layout: "horizontal", align: "center", width: 500, itemStyle: {width: 300}, margin: 30},
      series: [{
        name: "Engineer Traits",
        data: [{y: 80, description: "forcefully pursuing a goal", name: "Aggressive"}]
      }, {
        name: "Your Traits",
        data: [{y: 78, description: "forcefully pursuing a goal", name: "Aggressive"}]
      }],
      type: "column",
      xAxis: {type: "category"}
    };
  });

  it("renders column highchart", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
