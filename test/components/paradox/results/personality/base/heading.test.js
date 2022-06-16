import {Component} from "components/paradox/results/personality/base/heading";
import {mutable} from "lib/helpers/object";
import themeAssessment from "lib/helpers/theme-assessment";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import _assessment from "support/json/assessment/type-based.json";

jest.mock("lib/helpers/icon", () => ((props) => (
  <div className="mock">Icon - {props.icon.iconName}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityBaseHeading", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    const assessment = mutable(_assessment);

    options = {};
    props = {
      ...mockProps(["getOption", "setElement", "translate", "ui"]),
      assessment,
      personality: assessment.personality_types
        .find(({personality_type: type}) => type.name === "Inventor")
        .personality_type
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityBaseHeading.initialized",
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
        "PersonalityBaseHeading.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("fallbacks", () => {
    it("renders component with blend", () => {
      props.personality = null;
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with types", () => {
      props.assessment.personality_blend = null;
      props.personality = null;
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("perspective", () => {
    beforeEach(() => {
      options.perspective = "thirdPerson";
      mockOptions(props.getOption, {...options});
    });

    it("renders component", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with careers link", () => {
      mockOptions(props.getOption, {...options, careersLink: "/careers"});
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("themed", () => {
    beforeEach(() => {
      props.assessment = themeAssessment({data: props.assessment, theme: "paradox"});
      props.personality = themeAssessment({data: props.personality, theme: "paradox"});
    });

    it("renders component", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with blend", () => {
      props.personality = null;
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with types", () => {
      props.assessment.personality_blend = null;
      props.personality = null;
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with careers link", () => {
    mockOptions(props.getOption, {...options, careersLink: "/careers"});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {...options, disabledComponents: ["PersonalityHeading"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.personality = null;
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
