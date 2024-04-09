import Component from "components/results/feedback";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockUserCompletedFeedback} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

describe("Results.Feedback", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders empty when user has completed", async() => {
    mockAssessment(assessment, {id: assessment.id});
    mockUserCompletedFeedback(assessment.id, true);

    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
