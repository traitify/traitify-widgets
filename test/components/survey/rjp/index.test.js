/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/rjp";
import getCacheKey from "lib/common/get-cache-key";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {
  mockRjpAssessment as mockAssessment,
  mockRjpOptOut as mockOptOut,
  mockRjpStart as mockStart,
  mockRjpSubmit as mockSubmit,
  mockRjpSurvey as mockSurvey,
  useSettings
} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/rjp/incomplete";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";

const completedAt = "2024-02-01T00:00:00Z";
const survey = {
  fitResultBody: "You are a great fit",
  fitResultHeader: "Great fit",
  id: "rjp-survey-xyz",
  noFitResultBody: "This may not be the role for you",
  noFitResultHeader: "Not a fit",
  optOutButtonText: "",
  proceedButtonText: ""
};

describe("Survey.RJP", () => {
  let assessment;
  let assessmentCacheKey;
  let component;

  useContainer();
  useSettings({});

  const withQuestions = (overrides) => mutable({..._assessment, videos: [], ...overrides});
  const answered = (overrides) => withQuestions({
    responses: _assessment.responses.map((response) => ({
      ...response,
      selectedResponseOptionId: response.responseOptions[0].responseOptionId
    })),
    ...overrides
  });

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    assessmentCacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us"});

    mockAssessment(assessment);
    mockSurvey(survey);
    mockOption("surveyType", "rjp");
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.initialized",
        expect.any(Object)
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.updated",
        expect.any(Object)
      );
    });
  });

  describe("start", () => {
    it("calls start mutation when not yet started", async() => {
      mockAssessment(withQuestions({startedAt: null}));
      const mock = mockStart(assessment);
      component = await ComponentHandler.setup(Component);

      expect(mock.called).toBe(1);
    });

    it("does not call start when already started", async() => {
      mockAssessment(withQuestions());
      const mock = mockStart(assessment);
      component = await ComponentHandler.setup(Component);

      expect(mock.called).toBe(0);
    });
  });

  describe("submit", () => {
    it("submits answers", async() => {
      mockAssessment(answered());
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      component = await ComponentHandler.setup(Component);
      act(() => { component.findByText("Complete Questions").props.onClick(); });
      await flushAsync();

      expect(mock.called).toBe(1);
    });

    it("updates cached state", async() => {
      mockAssessment(answered());
      const mock = mockSubmit({...assessment, totalCorrectResponses: 2});
      component = await ComponentHandler.setup(Component);
      act(() => { component.findByText("Complete Questions").props.onClick(); });
      await flushAsync();

      expect(container.cache.set).toHaveBeenCalledWith(
        assessmentCacheKey,
        expect.objectContaining({totalCorrectResponses: 2})
      );
      expect(mock.called).toBe(1);
    });
  });

  describe("match", () => {
    beforeEach(() => {
      mockAssessment(answered({totalCorrectResponses: 2}));
    });

    it("continues", async() => {
      const mock = mockOptOut({implementation: () => new Promise(() => {})});
      component = await ComponentHandler.setup(Component);
      act(() => { component.findByText("Continue").props.onClick(); });
      await flushAsync();

      expect(mock.called).toBe(1);
    });

    it("opts out", async() => {
      const mock = mockOptOut({implementation: () => new Promise(() => {})});
      component = await ComponentHandler.setup(Component);
      act(() => { component.findByText("Not Interested").props.onClick(); });
      await flushAsync();

      expect(mock.called).toBe(1);
    });
  });

  it("renders nothing without assessment", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results ready", async() => {
    mockAssessment({...assessment, completedAt});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders questions", async() => {
    mockAssessment(withQuestions());
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders match results", async() => {
    mockAssessment(answered({isFit: true, totalCorrectResponses: 2}));
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
