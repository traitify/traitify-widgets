import {Component} from "components/results/personality/archetype/skills";
import ComponentHandler from "support/component-handler";
import _assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const details = [];

[
  {body: "WFH Tip", name: "Working From Home Tips"},
  {body: "DWS Tip", name: "Dealing With Stress"},
  {body: "C Tip", name: "Communication Tips"},
  {body: "T Tip", name: "Teamwork"},
  {body: "SM Tip", name: "Self Motivation"}
].forEach((type) => {
  Array.from(Array(5)).forEach((_, i) => {
    details.push({
      body: `${type.body} - ${i}`,
      title: `Success Skills - ${type.name}`
    });
  });
});

const assessment = {
  ..._assessment,
  archetype: {
    ..._assessment.archetype,
    details: [
      ..._assessment.archetype.details,
      ...details
    ]
  }
};

describe("PersonalityArchetypeSkills", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      options: {},
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

  it("renders component with available types", () => {
    props.assessment = {
      ...assessment,
      archetype: {
        ...assessment.archetype,
        details: assessment.archetype.details.filter((detail) => (
          detail.title !== "Success Skills - Working From Home Tips"
        ))
      }
    };
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with enabled types", () => {
    props.getOption.mockReturnValue(["Working From Home Tips"]);
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
    props.getOption.mockReturnValue(["PersonalitySkills"]);
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
    props.assessment = {...props.assessment, archetype: null};
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no tips", () => {
    props.assessment = {
      ...props.assessment,
      archetype: {
        ...props.assessment.archetype,
        details: [] // TODO: Leave in other section details
      }
    };
  });
});
