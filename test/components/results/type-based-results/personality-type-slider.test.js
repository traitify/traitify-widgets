import {Component} from "components/results/type-based-results/personality-type-slider";
import TypeButton from "components/results/type-based-results/personality-type-slider/type-button";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("components/results/type-based-results/personality-type-slide", () => ((props) => (
  <div className="mock">Slide - {props.type.personality_type.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTypeSlider", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
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

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeSlider.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeSlider.updated", component.instance);
    });

    it("triggers callbacks on setActive", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const type = props.assessment.personality_types[0];
      component.instance.setActive(type);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeSlider.changeType", component.instance, type);
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
      const type = props.assessment.personality_types[0];
      props.ui.current["Assessment.activeType"] = type;
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.state.activeType).toEqual(type);
    });

    it("updates state with new type", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const type = props.assessment.personality_types[0];
      props.ui.current["Assessment.activeType"] = type;
      component.instance.getActiveType();

      expect(component.state.activeType).toEqual(type);
    });
  });

  describe("type button", () => {
    beforeEach(() => {
      props = {
        setActive: jest.fn().mockName("setActive"),
        type: props.assessment.personality_types[0]
      };
    });

    it("renders component", () => {
      const component = new ComponentHandler(<TypeButton {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("calls setActive prop with type", () => {
      const component = new ComponentHandler(<TypeButton {...props} />);
      component.instance.setActive();

      expect(props.setActive).toHaveBeenCalledWith(props.type);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders back button", () => {
    props.ui.current["Assessment.activeType"] = props.assessment.personality_types.slice(-1)[0];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders next button", () => {
    props.ui.current["Assessment.activeType"] = props.assessment.personality_types[0];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders both buttons", () => {
    props.ui.current["Assessment.activeType"] = props.assessment.personality_types[1];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
