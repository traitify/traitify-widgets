import {Component} from "components/results/type-based-results/personality-type-slide";
import {detailWithPerspective} from "lib/helpers";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";

jest.mock("lib/helpers", () => ({detailWithPerspective: jest.fn().mockImplementation((options) => options.base.description)}));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityTypeSlide", () => {
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
    props.ui.current["Assessment.activeType"] = props.type;
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeSlide.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("PersonalityTypeSlide.updated", component.instance);
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

  it("renders nothing if no active type", () => {
    props.ui.current["Assessment.activeType"] = null;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if different active type", () => {
    props.ui.current["Assessment.activeType"] = assessment.personality_types[1];
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders type name correctly", () => {
    detailWithPerspective.mockImplementationOnce(() => props.type.personality_type.description.split("...").splice(1).join("..."));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
