import Component from "components/results/personality/base/styles";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/json/assessment/type-based.json";

describe("PersonalityBaseStyles", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.personality_types[0].personality_type.career_style = ["Creating", "Building from scratch", "Diving in deep"];
    assessment.personality_types[1].personality_type.career_style = ["Taking charge", "Setting trends", "Changing"];
    assessment.personality_types[2].personality_type.career_style = ["Goal-setting", "Equipment using", "Feasibility monitoring"];
    assessment.personality_types[3].personality_type.career_style = ["Studying", "Problem solving", "Mind-expanding"];
    assessment.personality_types[4].personality_type.career_style = ["Following steps", "Organizing", "Tracking details"];
    assessment.personality_types[5].personality_type.career_style = ["Helping", "Guiding", "Listening"];

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityStyles.initialized",
        expect.objectContaining({styles: expect.any()})
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityStyles.updated",
        expect.objectContaining({styles: expect.any()})
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", async() => {
    mockOption("showHeaders", true);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with less types", async() => {
    assessment.personality_types = [
      assessment.personality_types[0],
      assessment.personality_types[1]
    ];
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityStyles"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no styles", async() => {
    assessment = mutable(_assessment);
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
