import {Component} from "components/results";
import ComponentHandler from "support/component-handler";

jest.mock("components/results/candidate-results", () => (() => (<div className="mock">Candidate</div>)));
jest.mock("components/results/cognitive-results", () => (() => (<div className="mock">Cognitive</div>)));
jest.mock("components/results/dimension-based-results", () => (() => (<div className="mock">Dimension Based</div>)));
jest.mock("components/results/employee-results", () => (() => (<div className="mock">Employee</div>)));
jest.mock("components/results/financial-risk-results", () => (() => (<div className="mock">Financial Risk</div>)));
jest.mock("components/results/manager-results", () => (() => (<div className="mock">Manager</div>)));
jest.mock("components/results/type-based-results", () => (() => (<div className="mock">Type Based</div>)));
jest.mock("lib/with-traitify");

describe("Results", () => {
  let component;
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
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("Results.initialized", expect.objectContaining({
        props: expect.any(Object),
        state: expect.any(Object)
      }));
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Results.updated", expect.objectContaining({
        props: expect.any(Object),
        state: expect.any(Object)
      }));
    });
  });

  it("renders candidate results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED"};
    props.getOption.mockReturnValue("candidate");
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders cognitive results", () => {
    props.getOption.mockReturnValue("cognitive");
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders dimension based results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED"};
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders employee results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED"};
    props.getOption.mockReturnValue("employee");
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders financial risk results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED", scoring_scale: "LIKERT_CUMULATIVE_POMP"};
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders manager results", () => {
    props.assessment = {assessment_type: "DIMENSION_BASED"};
    props.getOption.mockReturnValue("manager");
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders type based results", () => {
    props.assessment = {assessment_type: "TYPE_BASED"};
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
