import {Component} from "components/results/candidate-results/personality-dimension-details";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityDimensionDetails", () => {
  let props;

  beforeEach(() => {
    props = {
      translate: jest.fn().mockName("translate"),
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
      props.translate.mockReturnValue("Detail Header");
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDimensionDetails.initialized", component.instance);
    });

    it("triggers update", () => {
      props.translate.mockReturnValue("Detail Header");
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityDimensionDetails.updated", component.instance);
    });
  });

  it("renders component", () => {
    props.translate.mockReturnValue("Detail Header");
    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
  });
});
