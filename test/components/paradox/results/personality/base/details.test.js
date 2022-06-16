import {Component} from "components/paradox/results/personality/base/details";
import {mutable} from "lib/helpers/object";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";
import assessment from "support/json/assessment/type-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityBaseDetails", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = {
      ...mockProps(["getOption", "setElement", "translate", "ui"]),
      assessment: mutable(assessment),
      personality: {
        details: [
          {body: "You work well with humans", title: "Complement"},
          {body: "You work poorly with aliens", title: "Conflict"}
        ],
        environments: [{name: "Home"}, {name: "Sweeeeet"}, {name: "Home?"}]
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityBaseDetails.initialized",
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
        "PersonalityBaseDetails.updated",
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

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {...options, allowHeaders: true});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with no environments", () => {
    props.personality.environments = null;
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from clicking button", () => {
    component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.instance.findAllByType("button")[1].props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from selecting option", () => {
    component = new ComponentHandler(<Component {...props} />);
    const select = component.instance.findByType("select");
    const option = component.instance.findAllByType("option")[2];
    component.act(() => select.props.onChange({target: option.props}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {...options, disabledComponents: ["PersonalityDetails"]});
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no details", () => {
    props.personality.details = [];
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
