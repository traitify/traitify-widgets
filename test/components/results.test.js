import {Component} from "components/results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/dimension-based-results", () => (() => (<div className="mock">Dimension Based</div>)));
jest.mock("components/results/financial-risk-results", () => (() => (<div className="mock">Financial Risk</div>)));
jest.mock("components/results/type-based-results", () => (() => (<div className="mock">Type Based</div>)));
jest.mock("lib/with-traitify");

describe("Results", () => {
  let props;

  beforeEach(() => {
    props = {
      isReady: jest.fn().mockName("isReady").mockReturnValue(false),
      getOption: jest.fn().mockName("getOption"),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("Results.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Results.updated", component.instance);
    });
  });

  it("renders dimension based results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED"};
    props.isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders financial risk results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED", scoring_scale: "LIKERT_CUMULATIVE_POMP"};
    props.isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders type based results", () => {
    props.assessment = {assessment_type: "TYPE_BASED"};
    props.isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
