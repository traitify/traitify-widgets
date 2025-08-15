import Component from "components/results/feedback/modal";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFeedbackSurvey, mockUserCompletedFeedback} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/data/assessment/personality/completed";
import feedbackSurvey from "support/data/feedback-survey.json";

jest.mock("components/common/icon", () => (() => <div className="mock">Close Btn</div>));

describe("Results.Feedback.Modal", () => {
  let component;

  useContainer({assessmentID: assessment.id});

  it("renders component", async() => {
    mockAssessment(assessment);
    mockUserCompletedFeedback(assessment.id, true);
    mockFeedbackSurvey(feedbackSurvey, assessment.deck_id);

    component = await ComponentHandler.setup(Component, {props: {onClose: jest.fn().mockName("onClose")}});

    expect(component.tree).toMatchSnapshot();
  });
});
