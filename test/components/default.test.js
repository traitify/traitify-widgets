import Component from "components/default";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockAssessments, mockCognitiveAssessment} from "support/container/http";
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
    let assessments;

    beforeEach(() => {
      assessments = {
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
    });

    it("renders cognitive survey", async() => {
      assessments.prerequisites.cognitive.status = "INCOMPLETE";
      mockAssessment(assessment, {id: assessment.id});
      mockCognitiveAssessment(cognitive);
      mockAssessments(assessments);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality results", async() => {
      mockAssessment(assessment, {id: assessment.id});
      mockAssessments(assessments);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality survey", async() => {
      assessments.prerequisites.personality.status = "INCOMPLETE";
      mockAssessment(assessmentWithSlides, {id: assessment.id});
      mockAssessments(assessments);
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

  it("renders nothing if not ready", async() => {
    mockAssessment({id: assessment.id, implementation: () => new Promise(() => {})});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
