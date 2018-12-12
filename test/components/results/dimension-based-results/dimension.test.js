import {Component} from "components/results/dimension-based-results/dimension";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger.mock.calls[0][0]).toBe("Dimension.initialized");
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger.mock.calls[1][0]).toBe("Dimension.updated");
    });

    it("triggers show content", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.trigger();

      expect(props.ui.trigger.mock.calls[1][0]).toBe("Dimension.showContent");
      expect(props.ui.trigger.mock.calls[1][2]).toBe(props.type.personality_type);
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

  describe("description", () => {
    it("defaults to first person", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const description = props.type.personality_type.details.find((detail) => (detail.title === "first_person_description"));

      expect(component.instance.description("description")).toBe(description.body);
    });

    it("shows third person", () => {
      props.getOption.mockReturnValue("thirdPerson");
      const component = new ComponentHandler(<Component {...props} />);
      const description = props.type.personality_type.details.find((detail) => (detail.title === "third_person_description"));

      expect(component.instance.description("description")).toBe(description.body);
    });

    it("falls back to third person", () => {
      const details = props.type.personality_type.details.filter((detail) => (detail.title !== "first_person_description"));
      props.type = {
        ...props.type,
        personality_type: {
          ...props.type.personality_type,
          details
        }
      };
      const component = new ComponentHandler(<Component {...props} />);
      const description = props.type.personality_type.details.find((detail) => (detail.title === "third_person_description"));

      expect(component.instance.description("description")).toBe(description.body);
    });

    it("falls back to first person", () => {
      props.getOption.mockReturnValue("thirdPerson");
      const details = props.type.personality_type.details.filter((detail) => (detail.title !== "third_person_description"));
      props.type = {
        ...props.type,
        personality_type: {
          ...props.type.personality_type,
          details
        }
      };
      const component = new ComponentHandler(<Component {...props} />);
      const description = props.type.personality_type.details.find((detail) => (detail.title === "first_person_description"));

      expect(component.instance.description("description")).toBe(description.body);
    });

    it("falls back to description", () => {
      const details = props.type.personality_type.details
        .filter((detail) => (detail.title !== "first_person_description"))
        .filter((detail) => (detail.title !== "third_person_description"));
      props.type = {
        ...props.type,
        personality_type: {
          ...props.type.personality_type,
          details
        }
      };
      const component = new ComponentHandler(<Component {...props} />);
      const {description} = props.type.personality_type;

      expect(component.instance.description("description")).toBe(description);
    });
  });
});
