import Component from "components/default";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {
  mockAssessment,
  mockCognitiveAssessment,
  mockExternalAssessment,
  mockRecommendation
} from "support/container/http";
import cognitive from "support/data/assessment/cognitive/completed";
import cognitiveIncomplete from "support/data/assessment/cognitive/incomplete";
import external from "support/data/assessment/external/completed";
import externalIncomplete from "support/data/assessment/external/incomplete";
import personality from "support/data/assessment/personality/dimension-based";
import personalityIncomplete from "support/data/assessment/personality/incomplete";
import recommendationCompleted from "support/data/recommendation/completed";
import recommendationIncomplete from "support/data/recommendation/incomplete";
import useContainer from "support/hooks/use-container";

jest.mock("components/results", () => (() => <div className="mock">Results</div>));
jest.mock("components/status", () => (() => <div className="mock">Status</div>));
jest.mock("components/survey", () => (() => <div className="mock">Survey</div>));

describe("Default", () => {
  let component;

  useContainer();

  describe("recommendation", () => {
    let recommendation;

    beforeEach(() => {
      recommendation = {
        benchmarkID: "benchmark-xyz",
        profileID: "profile-xyz",
        ...mutable(recommendationCompleted)
      };

      container.benchmarkID = recommendation.benchmarkID;
      container.profileID = recommendation.profileID;

      mockAssessment(personality, {mockRecommendation: false});
      mockCognitiveAssessment(cognitive, {mockRecommendation: false});
      mockExternalAssessment(external, {mockRecommendation: false});
      mockRecommendation(recommendation);
    });

    afterEach(() => {
      delete container.assessmentID;
      delete container.benchmarkID;
      delete container.profileID;
    });

    it("renders cognitive survey", async() => {
      recommendation.prerequisites.cognitive = recommendationIncomplete.prerequisites.cognitive;
      mockCognitiveAssessment(cognitiveIncomplete, {mockRecommendation: false});
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders external survey", async() => {
      recommendation.prerequisites.external[0] = recommendationIncomplete.prerequisites.external[0];
      mockExternalAssessment(externalIncomplete, {mockRecommendation: false});
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality results", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders personality survey", async() => {
      recommendation.prerequisites.personality = recommendationIncomplete.prerequisites.personality;
      mockAssessment(personalityIncomplete, {mockRecommendation: false});
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders results", async() => {
    container.assessmentID = personality.id;

    mockAssessment(personality);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders skipped", async() => {
    container.assessmentID = personality.id;

    mockAssessment({...personality, skipped: true});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders survey", async() => {
    container.assessmentID = personalityIncomplete.id;

    mockAssessment(personalityIncomplete);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
