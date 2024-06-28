import Component from "components/results/feedback";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFeedbackSurvey, mockUserCompletedFeedback} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import feedbackSurvey from "support/json/feedback-survey.json";

describe("Results.Feedback", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id);
    mockFeedbackSurvey(feedbackSurvey, assessment.deck_id);
    mockOption("perspective", "firstPerson");

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders empty when user has completed", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id, true);
    mockFeedbackSurvey(feedbackSurvey, assessment.deck_id);
    mockOption("perspective", "firstPerson");

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders empty when perspective is not firstPerson", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id);
    mockFeedbackSurvey(feedbackSurvey, assessment.deck_id);
    mockOption("perspective", "thirdPerson");

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
