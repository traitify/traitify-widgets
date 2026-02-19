/** @jest-environment jsdom */
/* eslint-disable no-console */
import {act} from "react-test-renderer";
import Component from "components/survey/generic";
import Instructions from "components/survey/generic/instructions";
import QuestionSet from "components/survey/generic/question-set";
import getCacheKey from "lib/common/get-cache-key";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockGenericAssessment as mockAssessment, mockGenericSubmit as mockSubmit} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/generic/incomplete";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/generic/instructions", () => (() => <div className="mock">Instructions</div>));
jest.mock("components/survey/generic/question-set", () => (() => <div className="mock">QuestionSet</div>));

const completedAt = "2024-01-01T00:00:00Z";

describe("Survey.Generic", () => {
  let assessment;
  let assessmentCacheKey;
  let component;

  useContainer();

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    assessmentCacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us"});

    mockAssessment(assessment);
    mockOption("surveyType", "generic");
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

  const answerSet = () => {
    act(() => {
      const {set, updateAnswer} = component.instance.findByType(QuestionSet).props;
      set.questions.forEach((question) => { updateAnswer({answer: question.responseOptions[0], question}); });
    });
  };

  describe("submit", () => {
    let originalWarn;

    beforeAll(() => { originalWarn = console.warn; });
    afterAll(() => { console.warn = originalWarn; });

    beforeEach(async() => {
      console.warn = jest.fn().mockName("warn");
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onClose(); });
      answerSet();
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });
      answerSet();
    });

    it("does nothing if already submitted", () => {
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });

      expect(mock.called).toBe(1);
    });

    it("submits query", () => {
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });

      expect(mock.calls).toMatchSnapshot();
    });

    it("updates cached state", async() => {
      mockAssessment({...assessment, completedAt});
      const mock = mockSubmit(assessment);
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });
      await flushAsync();

      expect(container.cache.remove).toHaveBeenCalledWith(assessmentCacheKey);
      expect(mock.called).toBe(1);
    });

    it("retries submit", async() => {
      const mockError = mockSubmit({implementation: () => Promise.resolve({json: () => ({errors: ["Oh no"]})})});
      act(() => { component.instance.findByType(QuestionSet).props.onNext(); });
      await act(async() => { jest.runOnlyPendingTimers(); });
      mockAssessment({...assessment, completedAt});
      const mock = mockSubmit({success: true});
      await act(async() => { jest.runOnlyPendingTimers(); });

      expect(console.warn).toHaveBeenCalled();
      expect(mockError.called).toBe(1);
      expect(mock.called).toBe(1);
    });
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading without assessment", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results ready", async() => {
    mockAssessment({...assessment, completedAt});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders question set", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onClose(); });

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
  });

  it("renders next question set", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onClose(); });
    answerSet();
    act(() => { component.instance.findByType(QuestionSet).props.onNext(); });

    expect(component.tree).toMatchSnapshot();
  });
});
