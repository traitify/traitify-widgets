import {Component} from "components/results/dimension-based-results/dimension";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/helpers", () => ({detailWithPerspective: (options) => options.base.description}));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Dimension", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption"),
      index: 1,
      translate: jest.fn().mockName("translate"),
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

      expect(props.ui.trigger).toHaveBeenCalledWith("Dimension.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("Dimension.updated", component.instance);
    });

    it("triggers show content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();

      expect(props.ui.trigger).toHaveBeenCalledWith("Dimension.showContent", component.instance, props.type.personality_type);
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  describe("with index of 0", () => {
    beforeEach(() => {
      props.index = 0;
    });

    it("shows content by default", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.state.showContent).toBe(true);
      expect(component.tree).toMatchSnapshot();
    });

    it("trigger toggles content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();

      expect(component.state.showContent).toBe(false);
    });

    it("assessment change resets content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();
      component.updateProps({assessmentID: "other"});

      expect(component.state.showContent).toBe(true);
    });
  });

  describe("with non-zero index", () => {
    it("hides content by default", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.state.showContent).toBe(false);
      expect(component.tree).toMatchSnapshot();
    });

    it("trigger toggles content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();

      expect(component.state.showContent).toBe(true);
    });

    it("assessment change resets content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();
      component.updateProps({assessmentID: "other"});

      expect(component.state.showContent).toBe(false);
    });
  });
});
