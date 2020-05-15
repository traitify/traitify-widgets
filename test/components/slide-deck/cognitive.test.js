import {Component} from "components/slide-deck/cognitive";
import Instructions from "components/slide-deck/cognitive/instructions";
import Slide from "components/slide-deck/cognitive/slide";
import Timer from "components/slide-deck/cognitive/timer";
import ComponentHandler from "support/component-handler";
import {flushPromises} from "support/helpers";
import assessment from "support/json/assessment/cognitive.json";

jest.mock("components/slide-deck/cognitive/instructions", () => (() => <div className="mock">Instructions</div>));
jest.mock("components/slide-deck/cognitive/slide", () => (() => <div className="mock">Slide</div>));
jest.mock("components/slide-deck/cognitive/timer", () => (() => <div className="mock">4:59</div>));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Cognitive", () => {
  const cacheKey = `cognitive.slide-deck.${assessment.id}`;
  let originalConfirm;
  let props;
  const lastUpdate = () => props.ui.trigger.mock.calls[props.ui.trigger.mock.calls.length - 1][1];

  beforeEach(() => {
    originalConfirm = window.confirm;
    window.confirm = jest.fn().mockName("confirm");

    props = {
      assessment,
      cache: {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      },
      getCognitiveAssessment: jest.fn().mockName("getCognitiveAssessment"),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockImplementation((value) => value === "questions"),
      traitify: {
        get: jest.fn().mockName("get"),
        post: jest.fn().mockName("post").mockResolvedValue(Promise.resolve()),
        put: jest.fn().mockName("put")
      },
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenNthCalledWith(
        1,
        "SlideDeck.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenNthCalledWith(
        2,
        "SlideDeck.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("setup", () => {
    it("requires an assessment", () => {
      props.assessment = null;

      new ComponentHandler(<Component {...props} />);

      expect(props.cache.get).not.toHaveBeenCalled();
    });

    it("sets everything from cache", () => {
      const state = {
        disability: true,
        onlySkipped: true,
        questions: [assessment.questions[0]],
        questionIndex: 1,
        skipped: [],
        startTime: Date.now()
      };
      props.cache.get.mockReturnValue(state);

      new ComponentHandler(<Component {...props} />);

      const lastState = lastUpdate().state;

      expect(props.cache.get).toHaveBeenCalled();
      expect(lastState.disability).toBe(state.disability);
      expect(lastState.initialQuestions).toBe(state.questions);
      expect(lastState.onlySkipped).toBe(state.onlySkipped);
      expect(lastState.questionIndex).toBe(state.questionIndex);
      expect(lastState.skipped).toBe(state.skipped);
      expect(lastState.startTime).toBe(state.startTime);
    });

    it("sets questions from props", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.cache.get).toHaveBeenCalled();
      expect(lastUpdate().state.initialQuestions).toBe(assessment.questions);
    });
  });

  describe("submit", () => {
    let component;
    let slide;
    let onFinish;
    let originalDate;

    beforeAll(() => {
      originalDate = Date.now;
    });

    beforeEach(() => {
      const now = Date.now();
      Date.now = jest.fn().mockName("now").mockReturnValue(now);

      props.assessment = {...assessment, questions: props.assessment.questions.slice(0, 1)};
      component = new ComponentHandler(<Component {...props} />);
      component.act(() => (
        component.instance.findByType(Instructions).props.onStart({disability: false})
      ));
      slide = component.instance.findByType(Slide);
      onFinish = component.instance.findByType(Timer).props.onFinish;

      Date.now = Date.now.mockReturnValue(now + 2000);
    });

    afterAll(() => {
      Date.now = originalDate;
    });

    it("does nothing if already submitted", () => {
      component.act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));
      props.traitify.post.mockClear();
      onFinish();

      expect(props.traitify.post).not.toHaveBeenCalled();
    });

    it("does nothing if results ready", () => {
      props.isReady.mockReturnValue(true);
      component.act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      expect(props.traitify.post).not.toHaveBeenCalled();
    });

    it("submits query", () => {
      component.act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      expect(props.traitify.post).toMatchSnapshot();
    });

    it("submits query with fallbacks", () => {
      onFinish();

      expect(props.traitify.post).toMatchSnapshot();
    });

    it("updates cached state", async() => {
      component.act(() => slide.props.onSelect({
        answerId: slide.props.question.responses[0].id,
        timeTaken: 600
      }));

      await flushPromises();

      expect(props.cache.set).toHaveBeenCalledWith(
        `${assessment.localeKey.toLowerCase()}.cognitive-assessment.${assessment.id}`,
        expect.objectContaining({
          completed: true, id: props.assessment.id
        })
      );
      expect(props.getCognitiveAssessment).toHaveBeenCalled();
    });
  });

  it("renders instructions", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading if questions finished", () => {
    props.assessment = {...assessment, questions: props.assessment.questions.slice(0, 1)};
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: false}));
    const slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading after skipped slides finished", () => {
    window.confirm.mockReturnValue(true);
    props.assessment = {...assessment, questions: props.assessment.questions.slice(0, 3)};
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[1].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[2].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 4,
      skipped: [1, 2],
      startTime: expect.any(Number)
    });
  });

  it("renders loading after skipped slides skipped", () => {
    window.confirm.mockReturnValue(false);
    props.assessment = {...assessment, questions: props.assessment.questions.slice(0, 3)};
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 3,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders nothing if results ready", () => {
    props.isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Slide)).toThrow();
  });

  it("renders skipped slides", () => {
    window.confirm.mockReturnValue(true);
    props.assessment = {...assessment, questions: props.assessment.questions.slice(0, 3)};
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: false}));
    let slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[0].id,
      timeTaken: 600
    }));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({skipped: true, timeTaken: 600}));
    slide = component.instance.findAllByType(Slide)[0];
    component.act(() => slide.props.onSelect({
      answerId: slide.props.question.responses[1].id,
      timeTaken: 600
    }));

    expect(component.tree).toMatchSnapshot();
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: true,
      questions: expect.any(Array),
      questionIndex: 1,
      skipped: [1],
      startTime: expect.any(Number)
    });
  });

  it("renders slide", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: false}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: false,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders slide with disability", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: true}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: true,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });

  it("renders slide with time limit disabled", () => {
    props.getOption.mockImplementation((value, nestedValue) => value === "slideDeck" && nestedValue === "disableTimeLimit");
    const component = new ComponentHandler(<Component {...props} />);
    const instructions = component.instance.findByType(Instructions);
    component.act(() => instructions.props.onStart({disability: true}));

    expect(component.tree).toMatchSnapshot();
    expect(() => component.instance.findByType(Instructions)).toThrow();
    expect(props.cache.set).toHaveBeenLastCalledWith(cacheKey, {
      disability: true,
      onlySkipped: false,
      questions: expect.any(Array),
      questionIndex: 0,
      skipped: null,
      startTime: expect.any(Number)
    });
  });
});
