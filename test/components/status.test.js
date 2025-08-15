import {act} from "react-test-renderer";
import Component from "components/status";
import mutable from "lib/common/object/mutable";
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
import cognitive from "support/data/assessment/cognitive/completed";
import cognitiveIncomplete from "support/data/assessment/cognitive/incomplete";
import cognitiveSkipped from "support/data/assessment/cognitive/skipped";
import external from "support/data/assessment/external/completed";
import externalIncomplete from "support/data/assessment/external/incomplete";
import personality from "support/data/assessment/personality/completed";
import benchmark from "support/data/benchmark";
import orderCompleted from "support/data/order/completed";
import orderIncomplete from "support/data/order/incomplete";
import profile from "support/data/profile";
import recommendationCompleted from "support/data/recommendation/completed";
import recommendationIncomplete from "support/data/recommendation/incomplete";

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
      orderResponse = mutable(orderCompleted);
      order = orderFromQuery({data: {order: orderResponse}});

      container.orderID = orderResponse.id;

      mockAssessment(personality, {mockRecommendation: false});
      mockCognitiveAssessment(cognitive, {mockRecommendation: false});
      mockExternalAssessment(external, {mockRecommendation: false});
      mockOrder(orderResponse);
    });

    afterEach(() => {
      delete container.orderID;
    });

    it("starts assessment", async() => {
      orderResponse.assessments[0] = orderIncomplete.assessments[0];
      orderResponse.status = orderIncomplete.status;
      order = orderFromQuery({data: {order: orderResponse}});
      mockCognitiveAssessment(cognitiveIncomplete, {mockRecommendation: false});
      mockOrder(orderResponse);
      component = await ComponentHandler.setup(Component);
      const button = component.findAllByText("Start Assessment")[0];
      act(() => { button.props.onClick(); });

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.start",
        {
          assessment: {
            ...order.assessments[0],
            ...assessmentFromQuery(cognitiveIncomplete),
            loaded: true,
            loading: false
          }
        }
      );
    });

    it("starts external assessment", async() => {
      orderResponse.assessments[1] = orderIncomplete.assessments[1];
      orderResponse.status = orderIncomplete.status;
      order = orderFromQuery({data: {order: orderResponse}});
      mockExternalAssessment(externalIncomplete, {mockRecommendation: false});
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
            ...assessmentFromQuery(externalIncomplete),
            loaded: true,
            loading: false
          }
        }
      );
    });

    it("starts external assessment with redirect", async() => {
      orderResponse.assessments[1] = orderIncomplete.assessments[1];
      orderResponse.status = orderIncomplete.status;
      order = orderFromQuery({data: {order: orderResponse}});
      mockExternalAssessment(externalIncomplete, {mockRecommendation: false});
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
      orderResponse.assessments[0] = orderIncomplete.assessments[0];
      orderResponse.status = orderIncomplete.status;
      order = orderFromQuery({data: {order: orderResponse}});
      mockCognitiveAssessment(cognitiveSkipped, {mockRecommendation: false});
      mockOrder(orderResponse);

      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("recommendation", () => {
    let recommendation;

    beforeEach(() => {
      recommendation = {
        benchmarkID: benchmark.id,
        profileID: profile.id,
        ...mutable(recommendationCompleted)
      };
      recommendation.prerequisites.external[0] = recommendationIncomplete.prerequisites.external[0];
      order = orderFromRecommendation({data: {recommendation}});

      container.benchmarkID = recommendation.benchmarkID;
      container.profileID = recommendation.profileID;

      mockAssessment(personality, {mockRecommendation: false});
      mockCognitiveAssessment(cognitive, {mockRecommendation: false});
      mockExternalAssessment(externalIncomplete, {mockRecommendation: false});
      mockRecommendation(recommendation);
    });

    afterEach(() => {
      delete container.benchmarkID;
      delete container.profileID;
    });

    it("starts assessment", async() => {
      recommendation.prerequisites.cognitive = recommendationIncomplete.prerequisites.cognitive;
      order = orderFromRecommendation({data: {recommendation}});
      mockCognitiveAssessment(cognitiveIncomplete, {mockRecommendation: false});
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);
      const button = component.findAllByText("Start Assessment")[0];
      act(() => { button.props.onClick(); });

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.start",
        {
          assessment: {
            ...order.assessments[1],
            ...assessmentFromQuery(cognitiveIncomplete),
            loaded: true,
            loading: false
          }
        }
      );
    });

    it("starts external assessment", async() => {
      mockOption("status", {allowRedirect: false});
      component = await ComponentHandler.setup(Component);
      const button = component.findByText("Start Assessment");
      act(() => { button.props.onClick(); });
      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.start",
        {
          assessment: {
            ...order.assessments[2],
            ...assessmentFromQuery(externalIncomplete),
            loaded: true,
            loading: false
          }
        }
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
      recommendation.prerequisites = {};
      mockRecommendation(recommendation);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });
});
