import Component from "components/results/feedback/modal";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFeedbackSurvey, mockUserCompletedFeedback} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import feedbackSurvey from "support/json/feedback-survey.json";

jest.mock("components/common/icon", () => (() => <div className="mock">Close Btn</div>));

describe("Results.Feedback.Modal", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id, true);
    mockFeedbackSurvey(feedbackSurvey, assessment.deck_id);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
