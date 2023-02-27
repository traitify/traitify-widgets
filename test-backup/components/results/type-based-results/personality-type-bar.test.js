import {Component} from "components/results/type-based-results/personality-type-bar";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTypeBar", () => {
  let props;

  beforeEach(() => {
    props = {
      barHeight: 50,
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeBar.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeBar.updated", component.instance);
    });

    it("triggers callbacks on setActive", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const type = assessment.personality_types[0];
      component.instance.setActive(type);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeBar.changeType", component.instance, type);
      expect(props.ui.trigger).toHaveBeenCalledWith("Assessment.activeType", component.instance, type);
    });
  });

  describe("active type", () => {
    it("listens to changes", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.on).toHaveBeenCalledWith("Assessment.activeType", component.instance.getActiveType);
    });

    it("unlistens to changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {getActiveType} = component.instance;
      component.unmount();

      expect(props.ui.off).toHaveBeenCalledWith("Assessment.activeType", getActiveType);
    });

    it("sets type if present", () => {
      props.ui.current["Assessment.activeType"] = props.type;
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.state.activeType).toEqual(props.type);
    });

    it("updates state with new activeType", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const type = assessment.personality_types[1];
      props.ui.current["Assessment.activeType"] = type;
      component.instance.getActiveType();

      expect(component.state.activeType).toEqual(type);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
