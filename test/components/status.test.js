import {act} from "react-test-renderer";
import Component from "components/status";
import ComponentHandler from "support/component-handler";
import {mockAssessments, mockCognitiveAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import cognitive from "support/json/assessment/cognitive.json";
import personality from "support/json/assessment/dimension-based.json";

const external = {
  assessmentId: "external-id",
  link: "https://external.traitify.com/external-assessment-id",
  status: "INCOMPLETE",
  surveyId: "external-assessment-id",
  surveyName: "Emmersion Assessment",
  vendor: "Emmersion"
};

const responseToArray = (response) => {
  const assessments = [];
  const {
    cognitive: cognitiveAssessment,
    external: externalAssessment,
    personality: personalityAssessment
  } = response.prerequisites || {};

  if(personalityAssessment && personalityAssessment.assessmentId) {
    assessments.push({
      completed: personalityAssessment.status === "COMPLETE",
      id: personalityAssessment.assessmentId,
      name: "Personality Assessment",
      type: "personality"
    });
  }

  if(cognitiveAssessment && cognitiveAssessment.testId) {
    assessments.push({
      completed: cognitiveAssessment.status === "COMPLETE",
      id: cognitiveAssessment.testId,
      name: "Cognitive Assessment",
      type: "cognitive"
    });
  }

  if(externalAssessment) {
    externalAssessment.forEach((assessment) => {
      assessments.push({
        completed: assessment.status === "COMPLETE",
        id: assessment.assessmentId,
        link: assessment.link,
        name: assessment.surveyName,
        type: "external"
      });
    });
  }

  return assessments;
};

describe("Status", () => {
  let assessments;
  let assessmentsResponse;
  let component;

  useContainer();

  beforeEach(() => {
    assessmentsResponse = {
      benchmarkID: "benchmark-id",
      prerequisites: {
        cognitive: {
          status: "COMPLETE",
          surveyId: cognitive.surveyId,
          testId: cognitive.id
        },
        external: [{...external}],
        personality: {
          assessmentId: personality.id,
          status: "COMPLETE",
          surveyId: personality.deck_id
        }
      },
      profileID: "profile-id"
    };
    assessments = responseToArray(assessmentsResponse);

    mockAssessments(assessmentsResponse);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Status.initialized",
        {assessments: null}
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Status.updated",
        {assessments}
      );
    });
  });

  it("starts assessment", async() => {
    assessmentsResponse.prerequisites.cognitive.status = "INCOMPLETE";
    assessments = responseToArray(assessmentsResponse);
    mockCognitiveAssessment(cognitive);
    mockAssessments(assessmentsResponse);
    component = await ComponentHandler.setup(Component);
    const button = component.findAllByText("Start Assessment")[0];
    act(() => button.props.onClick());

    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Survey.start",
      {assessment: assessments[1]}
    );
  });

  it("starts external assessment", async() => {
    mockOption("status", {allowRedirect: false});
    component = await ComponentHandler.setup(Component);
    const button = component.findByText("Start Assessment");
    act(() => button.props.onClick());

    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Survey.start",
      {assessment: assessments[2]}
    );
  });

  it("starts external assessment with redirect", async() => {
    component = await ComponentHandler.setup(Component);
    const button = component.findByText("Start Assessment");

    expect(button.props.href).toBe(external.link);
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if assessments not ready", async() => {
    mockAssessments({implementation: () => new Promise(() => {})});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no assessments", async() => {
    assessmentsResponse.prerequisites = {};
    assessments = responseToArray(assessmentsResponse);
    mockAssessments(assessmentsResponse);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
