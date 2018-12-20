import {Component} from "components/results/type-based-results/personality-type-bar-chart";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("components/results/type-based-results/personality-type-bar", () => ((props) => (
  <div className="mock">Bar - {props.type.personality_type.name}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTypeBarChart", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      assessmentID: assessment.id,
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
    props.ui.current["Assessment.activeType"] = props.assessment.personality_types[0];
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeBarChart.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeBarChart.updated", component.instance);
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
      const type = props.ui.current["Assessment.activeType"];
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.state.activeType).toEqual(type);
    });

    it("triggers callback if not present", () => {
      props.ui.current["Assessment.activeType"] = null;
      const component = new ComponentHandler(<Component {...props} />);
      const type = props.assessment.personality_types[0];

      expect(props.ui.trigger).toHaveBeenCalledWith("Assessment.activeType", component.instance, type);
    });

    it("updates state with new type", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const type = props.assessment.personality_types[0];
      props.ui.current["Assessment.activeType"] = type;
      component.instance.getActiveType();

      expect(component.state.activeType).toEqual(type);
    });

    it("removes type on assessment change", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({assessmentID: "other"});

      expect(props.ui.trigger).toHaveBeenCalledWith("Assessment.activeType", component.instance, null);
    });
  });

  it("adjusts bar height", () => {
    const types = props.assessment.personality_types;
    props.assessment = {
      ...props.assessment,
      personality_types: [
        {...types[0], score: 100},
        ...types.slice(1, -1),
        {...types[types.length - 1], score: 0}
      ]
    };
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.instance.barHeight(props.assessment.personality_types[0])).toBe(95);
    expect(component.instance.barHeight(props.assessment.personality_types.slice(-1)[0])).toBe(0);
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
});
