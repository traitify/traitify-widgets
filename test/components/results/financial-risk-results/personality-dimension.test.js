import {Component} from "components/results/financial-risk-results/personality-dimension";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/financial-risk.json";

jest.mock("lib/helpers", () => ({detailWithPerspective: jest.fn().mockImplementation((options) => options.base[options.name] || options.name)}));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityDimension", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption"),
      type: assessment.personality_types[0],
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDimension.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDimension.updated", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no characteristics", () => {
    props.type = {
      ...props.type,
      personality_type: {...props.type.personality_type, details: []}
    };
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
