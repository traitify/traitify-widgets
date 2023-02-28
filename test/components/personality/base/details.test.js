import {act} from "react-test-renderer";
import Component from "components/personality/base/details";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/json/assessment/type-based.json";

describe("PersonalityBaseDetails", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.archetype = {
      details: [
        {body: "You work well with humans", title: "Complement"},
        {body: "You work poorly with aliens", title: "Conflict"}
      ],
      environments: [{name: "Home"}, {name: "Sweeeeet"}, {name: "Home?"}]
    };

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityBaseDetails.initialized",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      component.updateProps();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityBaseDetails.updated",
        expect.objectContaining({activeType: expect.any(), types: expect.any()})
      );
    });
  });

  describe("fallbacks", () => {
    it("renders component with blend", async() => {
      assessment.archetype = null;
      mockAssessment(assessment);

      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with types", async() => {
      assessment.archetype = null;
      assessment.personality_blend = null;
      mockAssessment(assessment);

      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", async() => {
    mockOption("allowHeaders", true);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with no environments", async() => {
    assessment.archetype.environments = null;
    mockAssessment(assessment);

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
    const option = component.instance.findAllByType("option")[2];
    act(() => select.props.onChange({target: option.props}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityDetails"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no details", async() => {
    assessment.archetype.details = null;
    mockAssessment(assessment);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
