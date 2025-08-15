import Component from "components/report/attract";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/data/assessment/personality/completed";

jest.mock("components/results/personality/base/details", () => (() => <div className="mock">Personality Base Details</div>));
jest.mock("components/results/personality/base/styles", () => (() => <div className="mock">Personality Base Styles</div>));
jest.mock("components/results/personality/base/heading", () => (() => <div className="mock">Personality Base Heading</div>));
jest.mock("components/results/personality/trait/list", () => (() => <div className="mock">Personality Traits</div>));
jest.mock("components/results/personality/type/list", () => (() => <div className="mock">Personality Types</div>));

describe("Report.Attract", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    mockAssessment(assessment);
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Options.updated",
      expect.objectContaining({
        options: expect.not.objectContaining({disabledComponents: ["PersonalityBaseDetails", "PersonalityTraits"]})
      })
    );
  });

  it("renders component with disabled details", async() => {
    assessment.personality_types[0].personality_type.career_style = ["Creating", "Building from scratch", "Diving in deep"];
    mockAssessment(assessment);
    mockOption("disabledComponents", ["PersonalityBaseDetails"]);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Options.updated",
      expect.objectContaining({
        options: expect.objectContaining({disabledComponents: ["PersonalityBaseDetails", "PersonalityTraits"]})
      })
    );
  });

  it("renders component with disabled details and traits", async() => {
    assessment.personality_types[0].personality_type.career_style = ["Creating", "Building from scratch", "Diving in deep"];
    mockAssessment(assessment);
    mockOption("disabledComponents", ["PersonalityBaseDetails", "PersonalityTraits"]);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Options.updated",
      expect.objectContaining({
        options: expect.objectContaining({disabledComponents: ["PersonalityBaseDetails", "PersonalityTraits"]})
      })
    );
  });

  it("renders component with new content", async() => {
    assessment.personality_types[0].personality_type.career_style = ["Creating", "Building from scratch", "Diving in deep"];
    mockAssessment(assessment);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Options.updated",
      expect.objectContaining({
        options: expect.objectContaining({disabledComponents: ["PersonalityBaseDetails", "PersonalityTraits"]})
      })
    );
  });
});
