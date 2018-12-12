import {Component} from "components/results/dimension-based-results/personality-type";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityType", () => {
  let props;

  beforeEach(() => {
    props = {
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger.mock.calls[0][0]).toBe("PersonalityType.initialized");
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger.mock.calls[1][0]).toBe("PersonalityType.updated");
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
