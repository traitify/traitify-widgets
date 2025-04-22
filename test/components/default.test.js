import Component from "components/default";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockCognitiveAssessment, mockRecommendation} from "support/container/http";
import useContainer from "support/hooks/use-container";
import cognitive from "support/json/assessment/cognitive.json";
import assessment from "support/json/assessment/dimension-based.json";
import _assessmentWithSlides from "support/json/assessment/with-slides.json";

jest.mock("components/results", () => (() => <div className="mock">Results</div>));
jest.mock("components/survey", () => (() => <div className="mock">Survey</div>));

describe("Default", () => {
  let assessmentWithSlides;
  let component;

  useContainer();

  beforeEach(() => {
    assessmentWithSlides = {..._assessmentWithSlides, id: assessment.id};
  });

  describe("assessments", () => {
    let recommendation;

    beforeEach(() => {
      recommendation = {
        benchmarkID: "benchmark-id",
        prerequisites: {
          cognitive: {
            status: "COMPLETE",
            surveyId: cognitive.surveyId,
            testId: cognitive.id
          },
          personality: {
            assessmentId: assessment.id,
            status: "COMPLETE",
            surveyId: assessment.deck_id
          }
        },
        profileID: "profile-id"
      };

      mockAssessment(assessment, {id: assessment.id});
      mockCognitiveAssessment({...cognitive, completed: true});
      mockRecommendation(recommendation);
    });

    it("renders cognitive survey", async() => {
      recommendation.prerequisites.cognitive.status = "INCOMPLETE";
      mockCognitiveAssessment(cognitive);
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality results", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality survey", async() => {
      recommendation.prerequisites.personality.status = "INCOMPLETE";
      mockAssessment(assessmentWithSlides, {id: assessment.id});
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders results", async() => {
    mockAssessment(assessment, {id: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders survey", async() => {
    mockAssessment(assessmentWithSlides, {id: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading if not ready", async() => {
    mockAssessment({id: assessment.id, implementation: () => new Promise(() => {})});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
