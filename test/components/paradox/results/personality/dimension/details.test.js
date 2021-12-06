import {Component} from "components/paradox/results/personality/dimension/details";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityDimensionDetails", () => {
  let props;

  beforeEach(() => {
    props = {
      followGuide: jest.fn().mockName("followGuide"),
      getOption: jest.fn().mockName("getOption"),
      guide: {
        assessment_id: assessment.id,
        locale_key: assessment.locale_key,
        ...guide
      },
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
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

  it("renders component in third person", () => {
    mockOptions(props.getOption, {perspective: "thirdPerson"});

    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", () => {
    props.guide = null;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without pitfalls", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityPitfalls"]});

    const component = new ComponentHandler(<Component {...props} />);
    expect(component.tree).toMatchSnapshot();
  });
});
