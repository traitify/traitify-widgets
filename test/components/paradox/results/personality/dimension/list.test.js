import {Component} from "components/paradox/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/dimension/details", () => (() => (<div className="mock">PersonalityDimensionDetails</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityDimensionList", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensions.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensions.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {allowHeaders: true});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityDimensionDetails", "PersonalityDimensionChart"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders chart if details disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityDimensionDetails"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders details if chart disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityDimensionChart"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders details if columns disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityDimensionColumns"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
