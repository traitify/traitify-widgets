import Component from "components/paradox/results/personality/career/container";
import {mockProps, mockUI} from "support/helpers";
import careers from "support/json/careers.json";
import dimensionBasedResults from "support/json/assessment/dimension-based.json";
import ComponentHandler from "support/component-handler";
import I18n from "lib/i18n";
import {act} from "react-test-renderer";

jest.mock("lib/with-traitify", () => ((value) => value));
jest.mock("components/highchart", () => (() => <div className="mock">HighCharts</div>));

describe("Paradox.CareerContainer", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["followBenchmark", "followGuide", "getOption", "isReady", "setElement", "translate", "traitify"]),
      locale: "en",
      i18n: I18n,
      assessment: dimensionBasedResults,
      assessmentID: "test",
      options: null
    };
    props.i18n.data = {"en-us": {}};
    props.traitify.get = () => Promise.resolve(careers);
    props.ui = mockUI();
  });

  it("renders component with careers", async() => {
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with no careers", async() => {
    props.traitify.get = () => Promise.resolve([]);
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("modal opens", async() => {
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    act(() => {
      component.instance.findAllByType("button")[2].props.onClick();
    });
    expect(component.tree).toMatchSnapshot();
  });
});
