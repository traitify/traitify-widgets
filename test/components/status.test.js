import {act} from "react-test-renderer";
import Component from "components/status";
import orderFromQuery, {assessmentFromQuery, orderFromRecommendation} from "lib/common/order-from-query";
import ComponentHandler from "support/component-handler";
import {
  mockAssessment,
  mockCognitiveAssessment,
  mockExternalAssessment,
  mockOrder,
  mockRecommendation
} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";
import cognitive from "support/json/assessment/cognitive.json";
import personality from "support/json/assessment/dimension-based.json";
import external from "support/json/assessment/external.json";

describe("Status", () => {
  let component;
  let order;

  useContainer();
  useGlobalMock(console, "warn");

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

  describe("order", () => {
    let orderResponse;

    beforeEach(() => {
      orderResponse = {
        assessments: [
          {
            id: cognitive.id,
            status: "COMPLETED",
            surveyId: cognitive.surveyId,
            type: "COGNITIVE"
          },
          {
            id: external.assessmentId,
            status: "COMPLETED",
            surveyId: external.surveyId,
            type: "EXTERNAL"
          },
          {
            id: personality.id,
            status: "COMPLETED",
            surveyId: personality.deck_id,
            type: "PERSONALITY"
          }
        ],
        id: "order-id",
        profileID: "profile-id",
        requirements: {
          surveys: [
            {id: cognitive.surveyId, type: "COGNITIVE"},
            {id: external.surveyId, type: "EXTERNAL"},
            {id: personality.deck_id, type: "PERSONALITY"}
          ]
        },
        status: "COMPLETED"
      };
      order = orderFromQuery({data: {order: orderResponse}});

      mockAssessment(personality);
      mockCognitiveAssessment({...cognitive, completed: true});
      mockExternalAssessment({...external, status: "COMPLETED"});
      mockOrder(orderResponse);
    });

    it("starts assessment", async() => {
      orderResponse.assessments[0].status = "INCOMPLETE";
      orderResponse.status = "ALL_ASSESSMENT_AVAILABLE";
      order = orderFromQuery({data: {order: orderResponse}});
      mockCognitiveAssessment(cognitive);
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);
      const button = component.findAllByText("Start Assessment")[0];
      act(() => { button.props.onClick(); });

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.start",
        {assessment: {...order.assessments[0], loaded: true, loading: false}}
      );
    });

    it("starts external assessment", async() => {
      orderResponse.assessments[1].status = "INCOMPLETE";
      orderResponse.status = "ALL_ASSESSMENT_AVAILABLE";
      order = orderFromQuery({data: {order: orderResponse}});
      mockExternalAssessment({...external, status: "INCOMPLETE"});
      mockOption("status", {allowRedirect: false});
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);
      const button = component.findByText("Start Assessment");
      act(() => { button.props.onClick(); });
      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.start",
        {
          assessment: {
            ...order.assessments[1],
            ...assessmentFromQuery(external),
            loaded: true,
            loading: false
          }
        }
      );
    });

    it("starts external assessment with redirect", async() => {
      orderResponse.assessments[1].status = "INCOMPLETE";
      orderResponse.status = "ALL_ASSESSMENT_AVAILABLE";
      order = orderFromQuery({data: {order: orderResponse}});
      mockExternalAssessment({...external, status: "INCOMPLETE"});
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);
      const button = component.findByText("Start Assessment");

      expect(button.props.href).toBe(external.assessmentTakerUrl);
    });

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders error", async() => {
      orderResponse.assessments = [];
      orderResponse.status = "FAILED";
      order = orderFromQuery({data: {order: orderResponse}, errorMessage: "Uh oh"});
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
      expect(console.warn).toHaveBeenCalledWith("order", "Uh oh");
    });

    it("renders loading", async() => {
      orderResponse.assessments = [];
      orderResponse.status = "DRAFT";
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders skipped", async() => {
      mockCognitiveAssessment({...cognitive, completed: true, isSkipped: true});
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("recommendation", () => {
    let recommendationResponse;

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
      order = orderFromRecommendation({data: {recommendation: recommendationResponse}});

      mockAssessment(personality);
      mockCognitiveAssessment({...cognitive, completed: true});
      mockExternalAssessment(external);
      mockRecommendation(recommendationResponse);
    });

    it("starts assessment", async() => {
      recommendationResponse.prerequisites.cognitive.status = "INCOMPLETE";
      order = orderFromRecommendation({data: {recommendation: recommendationResponse}});
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
});
