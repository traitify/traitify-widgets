import {Component} from "components/paradox/results/personality/type/chart";
import {mutable} from "lib/helpers/object";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/type-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityTypeChart", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["getOption", "isReady", "setElement", "translate", "ui"]),
      assessment
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityTypes.initialized",
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
        "PersonalityTypes.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("update", () => {
    let updatedAssessment;

    beforeEach(() => {
      updatedAssessment = mutable(assessment);
      updatedAssessment.personality_types[0].personality_type.name = "Updated Name";
    });

    it("sets the data if the types change", () => {
      component = new ComponentHandler(<Component {...props} />);
      component.updateProps({assessment: updatedAssessment});

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("updates activeType", () => {
    component = new ComponentHandler(<Component {...props} />);
    const text = props.assessment.personality_types[1].personality_type.name;
    const button = component.instance
      .find((element) => element.props.alt === `${text} badge` && element.parent.parent.type === "button")
      .parent.parent;
    component.act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeType through select", () => {
    component = new ComponentHandler(<Component {...props} />);
    const value = props.assessment.personality_types[1].personality_type.id;
    component.act(() => component.instance.findByType("select").props.onChange({target: {value}}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {allowHeaders: true});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityTypes"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no types", () => {
    props.assessment.personality_types = [];
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
