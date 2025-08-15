import {act} from "react-test-renderer";
import Component from "components/results/personality/archetype/tips";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption, useOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/data/assessment/personality/dimension-based";

const details = [];
const tipTypes = {
  firstPerson: [
    {body: "CZ", title: "Caution Zone"},
    {body: "SWY", title: "Settings that Work for You"},
    {body: "TU", title: "Tools to Use"}
  ],
  thirdPerson: [
    {body: "TP CZ", title: "Third Person Caution Zone"},
    {body: "TP SWY", title: "Third Person Settings that Work for You"},
    {body: "TP TU", title: "Third Person Tools to Use"}
  ]
};

Object.keys(tipTypes).forEach((perspective) => {
  tipTypes[perspective].forEach((type) => {
    Array.from(Array(5)).forEach((_, i) => {
      details.push({body: `${type.body} - ${i}`, title: type.title});
    });
  });
});

describe("PersonalityArchetypeTips", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.archetype.details = [...details];

    container.assessmentID = assessment.id;

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTips.initialized",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTips.updated",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });
  });

  describe("thirdPerson", () => {
    useOption("perspective", "thirdPerson");

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders firstPerson tips if no thirdPerson tips", async() => {
      const typeKeys = tipTypes.thirdPerson.map((type) => type.title);
      assessment.archetype.details = details.filter(({title}) => !typeKeys.includes(title));
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with available types", async() => {
    assessment.archetype.details = details.filter(({title}) => title !== "Tools to Use");
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with enabled types", async() => {
    mockOption("disabledComponents", ["PersonalityTools"]);
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
    mockOption("disabledComponents", ["PersonalityTips"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", async() => {
    assessment.archetype = null;
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no tips", async() => {
    const typeKeys = [];
    Object.keys(tipTypes).forEach((perspective) => {
      tipTypes[perspective].forEach((type) => typeKeys.push(type.title));
    });
    assessment.archetype.details = details.filter(({title}) => !typeKeys.includes(title));
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
