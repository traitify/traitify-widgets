import {Component} from "components/results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/dimension-based-results", () => (() => (<div className="mock">Dimension Based</div>)));
jest.mock("components/results/financial-risk-results", () => (() => (<div className="mock">Financial Risk</div>)));
jest.mock("components/results/type-based-results", () => (() => (<div className="mock">Type Based</div>)));
jest.mock("lib/with-traitify");

describe("Results", () => {
  let ui;

  beforeEach(() => {
    ui = {
      current: {},
      off: jest.fn().mockName("off"),
      on: jest.fn().mockName("on"),
      trigger: jest.fn().mockName("trigger")
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component isReady={() => (false)} ui={ui} />);

      expect(ui.trigger).toHaveBeenCalledWith("Results.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component isReady={() => (false)} ui={ui} />);
      component.updateProps();

      expect(ui.trigger).toHaveBeenCalledWith("Results.updated", component.instance);
    });
  });

  it("renders dimension based results", () => {
    const assessment = {assessment_type: "DIMENSION_BASED"};
    const component = new ComponentHandler(
      <Component assessment={assessment} isReady={() => (true)} ui={ui} />
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("renders financial risk results", () => {
    const assessment = {assessment_type: "DIMENSION_BASED", scoring_scale: "LIKERT_CUMULATIVE_POMP"};
    const component = new ComponentHandler(
      <Component assessment={assessment} isReady={() => (true)} ui={ui} />
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("renders type based results", () => {
    const assessment = {assessment_type: "TYPE_BASED"};
    const component = new ComponentHandler(
      <Component assessment={assessment} isReady={() => (true)} ui={ui} />
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    const component = new ComponentHandler(
      <Component isReady={() => (false)} ui={ui} />
    );

    expect(component.tree).toMatchSnapshot();
  });
});
