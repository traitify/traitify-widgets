/** @jest-environment jsdom */
/* eslint-disable no-console */
import {act} from "react-test-renderer";
import Component from "components/survey/cognitive";
import Instructions from "components/survey/cognitive/instructions";
import Slide from "components/survey/cognitive/slide";
import Timer from "components/survey/cognitive/timer";
import getCacheKey from "lib/common/get-cache-key";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockCognitiveAssessment as mockAssessment, mockCognitiveSubmit as mockSubmit} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/cognitive/incomplete";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";
import useWindowMock from "support/hooks/use-window-mock";

jest.mock("components/survey/cognitive/instructions", () => (() => <div className="mock">Instructions</div>));
jest.mock("components/survey/cognitive/slide", () => (() => <div className="mock">Slide</div>));
jest.mock("components/survey/cognitive/timer", () => (() => <div className="mock">4:59</div>));

describe("Survey.Cognitive", () => {
  let assessment;
  let assessmentCacheKey;
  let cacheKey;
  let component;
  let options;
  const lastUpdate = () => (
    container.listener.trigger.mock.calls[container.listener.trigger.mock.calls.length - 1][1]
  );

  useContainer();
  useWindowMock("confirm");

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    assessmentCacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us"});
    cacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us", scope: ["slides"]});
    options = {};

    mockAssessment(assessment);
    mockOption("survey", options);
    mockOption("surveyType", "cognitive");
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

  describe("setup", () => {
    it("requires an assessment", async() => {
      mockAssessment(null);
      await ComponentHandler.setup(Component);

      expect(container.cache.get).not.toHaveBeenCalledWith(cacheKey);
    });

    it("sets everything from cache", async() => {
      const state = {
        disability: true,
        onlySkipped: false,
        questions: assessment.questions.slice(0, 3),
        questionIndex: 1,
        skipped: [],
        startTime: Date.now()
      };
      container.cache.set(cacheKey, state);
      await ComponentHandler.setup(Component);

      const lastState = lastUpdate();

      expect(container.cache.get).toHaveBeenCalledWith(cacheKey);
      expect(lastState.disability).toBe(state.disability);
      expect(lastState.initialQuestions).toEqual(state.questions);
      expect(lastState.onlySkipped).toBe(state.onlySkipped);
      expect(lastState.questionIndex).toBe(state.questionIndex);
      expect(lastState.skipped).toEqual(state.skipped);
      expect(lastState.startTime).toBe(state.startTime);
    });

    it("sets questions from props", async() => {
      await ComponentHandler.setup(Component);

      expect(container.cache.get).toHaveBeenCalledWith(cacheKey);
      expect(lastUpdate().initialQuestions).toBe(assessment.questions);
    });
  });

  describe("submit", () => {
    let slide;
    let onFinish;
    let originalWarn;

    beforeAll(() => {
      originalWarn = console.warn;
    });

    beforeEach(async() => {
      console.warn = jest.fn().mockName("warn");
      mockAssessment({...assessment, questions: assessment.questions.slice(0, 1)});
      component = await ComponentHandler.setup(Component);
      act(() => {
        component.instance.findByType(Instructions).props.onStart({disability: false});
      });
      jest.advanceTimersByTime(2000);
      slide = component.instance.findByType(Slide);
      onFinish = component.instance.findByType(Timer).props.onFinish;
    });

    afterAll(() => {
      console.warn = originalWarn;
    });

    it("does nothing if already submitted", () => {
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));
      onFinish();

      expect(mock.called).toBe(1);
    });

    it("submits query", () => {
      mockAssessment({...assessment, completed: true});
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      expect(mock.calls).toMatchSnapshot();
    });

    it("submits query with fallbacks", () => {
      mockAssessment({...assessment, completed: true});
      const mock = mockSubmit({implementation: () => new Promise(() => {})});
      onFinish();

      expect(mock.calls).toMatchSnapshot();
    });

    it("updates cached state", async() => {
      mockAssessment({...assessment, completed: true});
      const mock = mockSubmit({success: true});
      act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      await flushAsync();

      expect(container.cache.set).toHaveBeenCalledWith(
        assessmentCacheKey,
        expect.objectContaining({completed: true, id: assessment.id})
      );
      expect(mock.called).toBe(1);
    });

    it("retries submit", async() => {
      const mockError = mockSubmit({implementation: () => Promise.resolve({json: () => ({errors: ["Oh no", "Not good"]})})});
      act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      await act(async() => { jest.runOnlyPendingTimers(); });
      mockAssessment({...assessment, completed: true});
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

  it("renders loading if questions finished", async() => {
    mockAssessment({...assessment, questions: assessment.questions.slice(0, 1)});
    mockSubmit({implementation: () => new Promise(() => {})});
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: false}));
    const slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading after skipped slides finished", async() => {
    mockAssessment({...assessment, questions: assessment.questions.slice(0, 3)});
    mockSubmit({implementation: () => new Promise(() => {})});
    window.confirm.mockReturnValue(true);
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[1].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[2].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 4,
      skipped: [1, 2],
      startTime: expect.any(Number)
    });
  });

  it("renders loading after skipped slides skipped", async() => {
    mockAssessment({...assessment, questions: assessment.questions.slice(0, 3)});
    mockSubmit({implementation: () => new Promise(() => {})});
    window.confirm.mockReturnValue(false);
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 3,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders nothing if results ready", async() => {
    mockAssessment({...assessment, completed: true});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Slide)).toThrow();
  });

  it("renders skipped slides", async() => {
    mockAssessment({...assessment, questions: assessment.questions.slice(0, 3)});
    window.confirm.mockReturnValue(true);
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[1].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 1,
      skipped: [1],
      startTime: expect.any(Number)
    });
  });

  it("renders slide", async() => {
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: false}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders slide with disability", async() => {
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: true}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: true,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders slide with time limit disabled", async() => {
    mockOption("survey", {...options, disableTimeLimit: true});
    component = await ComponentHandler.setup(Component);
    const instructions = component.instance.findByType(Instructions);
    act(() => instructions.props.onStart({disability: true}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(container.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: true,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });
});
