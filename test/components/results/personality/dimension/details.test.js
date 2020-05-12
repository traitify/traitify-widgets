import {Component} from "components/results/personality/dimension/details";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("PersonalityDimensionDetails", () => {
  let props;

  beforeEach(() => {
    props = {
      translate: jest.fn().mockName("translate").mockReturnValue("Detail Header"),
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
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionDetails.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionDetails.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with pitfalls", () => {
    props.getOption.mockReturnValue("thirdPerson");

    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
  });
});
