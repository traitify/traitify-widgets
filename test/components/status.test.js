import {act} from "react-test-renderer";
import Component from "components/status";
import ComponentHandler from "support/component-handler";
import {
  mockAssessment,
  mockCognitiveAssessment,
  mockExternalAssessment,
  mockRecommendation
} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import cognitive from "support/json/assessment/cognitive.json";
import personality from "support/json/assessment/dimension-based.json";

const external = {
  assessmentId: "external-id",
  assessmentTakerUrl: "https://external.traitify.com/external-assessment-id",
  status: "INCOMPLETE",
  surveyId: "external-assessment-id",
  surveyName: "Emmersion Assessment",
  vendor: "Emmersion"
};

const responseToOrder = (response) => {
  const order = {assessments: [], surveys: []};
  const {
    cognitive: cognitiveAssessment,
    external: externalAssessment,
    personality: personalityAssessment
  } = response.prerequisites || {};

  if(personalityAssessment && personalityAssessment.assessmentId) {
    order.assessments.push({
      completed: personalityAssessment.status === "COMPLETE",
      id: personalityAssessment.assessmentId,
      surveyID: personalityAssessment.surveyId,
      surveyName: "Personality Assessment",
      surveyType: "personality"
    });
    order.surveys.push({id: personalityAssessment.surveyId, type: "personality"});
  }

  if(cognitiveAssessment && cognitiveAssessment.testId) {
    order.assessments.push({
      completed: cognitiveAssessment.status === "COMPLETE",
      id: cognitiveAssessment.testId,
      surveyID: cognitiveAssessment.surveyId,
      surveyName: "Cognitive Assessment",
      surveyType: "cognitive"
    });
    order.surveys.push({id: cognitiveAssessment.surveyId, type: "cognitive"});
  }

  if(externalAssessment) {
    externalAssessment.forEach((assessment) => {
      order.assessments.push({
        completed: assessment.status === "COMPLETE",
        id: assessment.assessmentId,
        link: assessment.assessmentTakerUrl,
        surveyID: assessment.surveyId,
        surveyName: assessment.surveyName,
        surveyType: "external"
      });
      order.surveys.push({id: assessment.surveyId, type: "external"});
    });
  }
  order.cacheKey = [response.benchmarkID, response.profileID].join("-");
  order.completed = order.assessments.every(({completed}) => completed);
  order.errors = response.errors;

  if(order.completed) {
    order.status = "completed";
  } else if(response.errors) {
    order.status = "error";
  } else {
    order.status = "incomplete";
  }
  return order;
};

describe("Status", () => {
  let component;
  let order;
  let recommendationResponse;

  useContainer();

  beforeEach(() => {
    recommendationResponse = {
      benchmarkID: "benchmark-id",
      prerequisites: {
        cognitive: {
          status: "COMPLETE",
          surveyId: cognitive.surveyId,
          surveyName: "Cognitive Assessment",
          testId: cognitive.id
        },
        external: [{...external}],
        personality: {
          assessmentId: personality.id,
          status: "COMPLETE",
          surveyId: personality.deck_id,
          surveyName: "Personality Assessment"
        }
      },
      profileID: "profile-id"
    };
    order = responseToOrder(recommendationResponse);

    mockAssessment(personality);
    mockCognitiveAssessment({...cognitive, completed: true});
    mockExternalAssessment(external);
    mockRecommendation(recommendationResponse);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Status.initialized",
        {order: null}
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Status.updated",
        {order: null}
      );
    });
  });

  it("starts assessment", async() => {
    recommendationResponse.prerequisites.cognitive.status = "INCOMPLETE";
    order = responseToOrder(recommendationResponse);
    mockCognitiveAssessment(cognitive);
    mockRecommendation(recommendationResponse);
    component = await ComponentHandler.setup(Component);
    const button = component.findAllByText("Start Assessment")[0];
    act(() => { button.props.onClick(); });

    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Survey.start",
      {assessment: {...order.assessments[1], loaded: true, loading: false}}
    );
  });

  it("starts external assessment", async() => {
    mockOption("status", {allowRedirect: false});
    component = await ComponentHandler.setup(Component);
    const button = component.findByText("Start Assessment");
    act(() => { button.props.onClick(); });
    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Survey.start",
      {assessment: {...order.assessments[2], loaded: true, loading: false}}
    );
  });

  it("starts external assessment with redirect", async() => {
    component = await ComponentHandler.setup(Component);
    const button = component.findByText("Start Assessment");

    expect(button.props.href).toBe(external.assessmentTakerUrl);
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if assessments not ready", async() => {
    mockRecommendation({implementation: () => new Promise(() => {})});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no assessments", async() => {
    recommendationResponse.prerequisites = {};
    mockRecommendation(recommendationResponse);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
