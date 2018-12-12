import {Component} from "components/results";
import ComponentHandler from "support/component-handler";

jest.mock("lib/with-traitify");
jest.mock("components/results/dimension-based-results", () => (() => (<div className="mock">Dimension Based</div>)));
jest.mock("components/results/type-based-results", () => (() => (<div className="mock">Type Based</div>)));

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

  it("renders dimension based results", () => {
    const assessment = {assessment_type: "DIMENSION_BASED"};
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

  it("triggers initialization callback", () => {
    new ComponentHandler(<Component isReady={() => (false)} ui={ui} />);

    expect(ui.trigger.mock.calls[0][0]).toBe("Results.initialized");
  });

  it("triggers update callback", () => {
    const component = new ComponentHandler(
      <Component isReady={() => (false)} ui={ui} />
    );
    component.updateProps();

    expect(ui.trigger.mock.calls[1][0]).toBe("Results.updated");
  });
});
