import {Component} from "components/results/type-based-results/personality-badge";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityBadge", () => {
  let props;

  beforeEach(() => {
    props = {
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      type: assessment.personality_types[0].personality_type,
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityBadge.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityBadge.updated", component.instance);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
