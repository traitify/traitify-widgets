import {Component} from "components/paradox/results/personality/archetype/skills";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const details = [];

assessment.personality_types.forEach(({personality_type: dimension}) => {
  [
    {body: "EA Tip", name: "Everyday Adjustments"},
    {body: "DWS Tip", name: "Dealing With Stress"},
    {body: "L Tip", name: "Leading Others"},
    {body: "C Tip", name: "Communication"},
    {body: "T Tip", name: "Teamwork"},
    {body: "Hot Tip", name: "Habits To Build"}
  ].forEach((type) => {
    Array.from(Array(5)).forEach(() => {
      details.push({
        body: `${type.body} for ${dimension.name}`,
        title: `${type.name} - Success Skills - ${dimension.name}`
      });
    });
  });
});

describe("Paradox.PersonalityArchetypeSkills", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment: {...assessment, archetype: {...assessment.archetype, details: [...details]}},
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
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
        "PersonalitySkills.initialized",
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
        "PersonalitySkills.updated",
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

  it("renders component with available dimension skills", () => {
    const missingDimension = props.assessment.personality_types[0].personality_type;
    props.assessment.archetype.details = details
      .filter(({title}) => !title.endsWith(missingDimension.name));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with available types", () => {
    props.assessment.archetype.details = details
      .filter(({title}) => !title.startsWith("Dealing With Stress - Success Skills"));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with enabled types", () => {
    mockOptions(props.getOption, {disabledComponents: ["Dealing With Stress"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", () => {
    mockOptions(props.getOption, {allowHeaders: true});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from clicking button", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.instance.findAllByType("button")[1].props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from selecting option", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const select = component.instance.findByType("select");
    const option = component.instance.findAllByType("option")[1];
    component.act(() => select.props.onChange({target: option.props}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalitySkills"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", () => {
    props.assessment.archetype = null;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no skills", () => {
    props.assessment.archetype.details = details
      .filter(({title}) => !title.includes("Success Skills"));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
