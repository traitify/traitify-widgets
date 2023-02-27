import {Component} from "components/paradox/results/personality/dimension/details";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityDimensionDetails", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["followGuide", "getOption", "setElement", "translate", "ui"]),
      guide: {
        assessment_id: assessment.id,
        locale_key: assessment.locale_key,
        ...guide
      },
      type: assessment.personality_types[0]
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionDetails.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
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
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component in third person", () => {
    mockOptions(props.getOption, {perspective: "thirdPerson"});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", () => {
    props.guide = null;
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without pitfalls", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityPitfalls"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
