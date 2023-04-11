import {act} from "react-test-renderer";
import Component from "components/results/personality/archetype/skills";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/json/assessment/dimension-based.json";

const details = [];

_assessment.personality_types.forEach(({personality_type: dimension}) => {
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

describe("PersonalityArchetypeSkills", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.archetype.details = [...details];

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalitySkills.initialized",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalitySkills.updated",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with available dimension skills", async() => {
    const missingDimension = assessment.personality_types[0].personality_type;
    assessment.archetype.details = details
      .filter(({title}) => !title.endsWith(missingDimension.name));
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with available types", async() => {
    assessment.archetype.details = details
      .filter(({title}) => !title.startsWith("Dealing With Stress - Success Skills"));
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with enabled types", async() => {
    mockOption("disabledComponents", ["Dealing With Stress"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", async() => {
    mockOption("showHeaders", true);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from clicking button", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => component.instance.findAllByType("button")[1].props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from selecting option", async() => {
    component = await ComponentHandler.setup(Component);
    const select = component.instance.findByType("select");
    const option = component.instance.findAllByType("option")[1];
    act(() => select.props.onChange({target: option.props}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalitySkills"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", async() => {
    mockAssessment({...assessment, archetype: null});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no skills", async() => {
    assessment.archetype.details = details
      .filter(({title}) => !title.includes("Success Skills"));
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
