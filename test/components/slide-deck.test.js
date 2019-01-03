import {Component} from "components/slide-deck";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/with-slides.json";
import * as helpers from "components/slide-deck/helpers";

jest.mock("components/slide-deck/loading", () => (() => (<div className="mock">Loading</div>)));
jest.mock("components/slide-deck/slide", () => (() => (<div className="mock">Slide</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("SlideDeck", () => {
  let completedSlides;
  let finish;
  let getStateFromProps;
  let isFinished;
  let isReady;
  let props;
  let setState;
  let toggleFullscreen;

  beforeEach(() => {
    completedSlides = jest.spyOn(helpers, "completedSlides");
    finish = jest.spyOn(Component.prototype, "finish");
    getStateFromProps = jest.spyOn(helpers, "getStateFromProps");
    isFinished = jest.spyOn(helpers, "isFinished");
    isReady = jest.spyOn(helpers, "isReady");
    setState = jest.spyOn(Component.prototype, "setState");
    toggleFullscreen = jest.spyOn(helpers, "toggleFullscreen");

    props = {
      assessment,
      assessmentID: assessment.id,
      cache: {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      },
      getAssessment: jest.fn().mockName("getAssessment"),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockImplementation(() => false),
      traitify: {
        get: jest.fn().mockName("get"),
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
    finish.mockRestore();
    getStateFromProps.mockRestore();
    isFinished.mockRestore();
    isReady.mockRestore();
    setState.mockRestore();
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.updated", component.instance);
    });
  });

  describe("initialization", () => {
    it("does nothing if no slides", () => {
      getStateFromProps.mockReturnValue({slides: []});
      isFinished.mockReturnValue(false);
      new ComponentHandler(<Component {...props} />);

      expect(finish).not.toHaveBeenCalled();
      expect(setState).not.toHaveBeenCalled();
    });

    it("calls finish if slides are finished", () => {
      finish.mockImplementation(() => {});
      isFinished.mockReturnValue(true);
      new ComponentHandler(<Component {...props} />);

      expect(finish).toHaveBeenCalled();
      expect(setState).not.toHaveBeenCalled();
    });

    it("calls resize images if slides are present", () => {
      getStateFromProps.mockReturnValue({slides: assessment.slides});
      isFinished.mockReturnValue(false);
      setState.mockImplementation(() => {});
      new ComponentHandler(<Component {...props} />);

      expect(finish).not.toHaveBeenCalled();
      expect(setState).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    beforeEach(() => {
      getStateFromProps.mockReturnValue({slides: []});
      isFinished.mockReturnValue(false);
    });

    it("does nothing if assessment doesn't change", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({finished: true});

      expect(finish).not.toHaveBeenCalled();
      expect(setState).toHaveBeenCalledTimes(1);
    });

    it("calls finish if slides are finished", () => {
      finish.mockImplementation(() => {});
      props.assessment = null;
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.resizeImages = jest.fn().mockName("resizeImages");
      getStateFromProps.mockReturnValue({slides: assessment.slides});
      isFinished.mockReturnValue(true);
      component.updateProps({assessment});

      expect(setState).toHaveBeenCalledWith({slides: assessment.slides}, expect.any(Function));
      expect(finish).toHaveBeenCalled();
      expect(component.instance.resizeImages).not.toHaveBeenCalled();
    });

    it("calls resize images if slides are present", () => {
      finish.mockImplementation(() => {});
      props.assessment = null;
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.resizeImages = jest.fn().mockName("resizeImages");
      getStateFromProps.mockReturnValue({slides: assessment.slides});
      isFinished.mockReturnValue(false);
      component.updateProps({assessment});

      expect(setState).toHaveBeenCalledWith({slides: assessment.slides}, expect.any(Function));
      expect(finish).not.toHaveBeenCalled();
      expect(component.instance.resizeImages).toHaveBeenCalled();
    });

    it("only updates state if slides are empty", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.resizeImages = jest.fn().mockName("resizeImages");
      getStateFromProps.mockReturnValue({slides: []});
      component.updateProps({assessment: null});

      expect(setState).toHaveBeenCalledWith({slides: []}, expect.any(Function));
      expect(finish).not.toHaveBeenCalled();
      expect(component.instance.resizeImages).not.toHaveBeenCalled();
    });
  });

  describe("fetch images", () => {
    let componentDidUpdate;
    let createElement;

    beforeAll(() => {
      componentDidUpdate = jest.spyOn(Component.prototype, "componentDidUpdate");
      componentDidUpdate.mockImplementation(() => {});
      createElement = jest.spyOn(document, "createElement");
    });

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      componentDidUpdate.mockRestore();
      createElement.mockRestore();
    });

    it("does nothing if image loading", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({imageLoading: true});
      setState.mockClear();
      component.instance.fetchImages();

      expect(setState).not.toHaveBeenCalled();
    });

    it("does nothing if slides loaded", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const slides = assessment.slides.map((slide) => ({...slide, loaded: true}));
      component.updateState({imageLoading: false, slides});
      setState.mockClear();
      component.instance.fetchImages();

      expect(setState).not.toHaveBeenCalled();
    });

    it("does nothing after too many failed attempts", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({imageLoading: false, imageLoadingAttempts: 3});
      setState.mockClear();
      component.instance.fetchImages();

      expect(setState).not.toHaveBeenCalled();
    });

    it("handles image loading", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({imageLoading: false});
      createElement.mockClear();
      setState.mockClear();
      component.instance.fetchImages();
      const image = createElement.mock.results[0].value;
      component.instance.fetchImages = jest.fn().mockName("fetchImages");
      image.onload();

      expect(setState).toHaveBeenCalled();
      expect(component.state.imageLoading).toBe(false);
      expect(component.state.imageLoadingAttempts).toBe(0);
      expect(component.state.slides.filter((slide) => slide.loaded)).toHaveLength(1);
      expect(component.instance.fetchImages).toHaveBeenCalled();
    });

    it("handles image error ", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({imageLoading: false});
      createElement.mockClear();
      setState.mockClear();
      component.instance.fetchImages();
      const image = createElement.mock.results[0].value;
      image.onerror();

      expect(setState).toHaveBeenCalled();
      expect(component.state.imageLoading).toBe(false);
      expect(component.state.imageLoadingAttempts).toBe(1);
      expect(component.state.slides.filter((slide) => slide.loaded)).toHaveLength(0);
      expect(setTimeout).toHaveBeenCalledWith(component.instance.fetchImages, 2000);
    });
  });

  describe("resize", () => {
    let componentDidUpdate;
    let originalAddEventListener;
    let originalRemoveEventListener;

    beforeAll(() => {
      originalAddEventListener = window.addEventListener;
      originalRemoveEventListener = window.removeEventListener;
      window.addEventListener = jest.fn()
        .mockName("addEventListener")
        .mockImplementation(originalAddEventListener);
      window.removeEventListener = jest.fn()
        .mockName("removeEventListener")
        .mockImplementation(originalRemoveEventListener);
    });

    beforeEach(() => {
      componentDidUpdate = jest.spyOn(Component.prototype, "componentDidUpdate");
    });

    afterEach(() => {
      componentDidUpdate.mockRestore();
      window.addEventListener.mockClear();
      window.removeEventListener.mockClear();
    });

    afterAll(() => {
      window.addEventListener = originalAddEventListener;
      window.removeEventListener = originalRemoveEventListener;
    });

    it("adds event listener", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {instance} = component;

      expect(window.addEventListener).toHaveBeenCalledWith("resize", instance.resizeImages);
      expect(window.removeEventListener).not.toHaveBeenCalledWith("resize", instance.resizeImages);
    });

    it("removes event listener", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {instance} = component;
      component.unmount();

      expect(window.addEventListener).toHaveBeenCalledWith("resize", instance.resizeImages);
      expect(window.removeEventListener).toHaveBeenCalledWith("resize", instance.resizeImages);
    });

    it("updates slides", () => {
      componentDidUpdate.mockImplementation(() => {});
      const component = new ComponentHandler(<Component {...props} />);
      props.getOption.mockImplementationOnce(() => "http://localhost:8080");
      component.instance.container = {clientHeight: 200, clientWidth: 100};
      component.instance.fetchImages = jest.fn().mockName("fetchImages");
      component.instance.resizeImages();

      expect(component.instance.fetchImages).toHaveBeenCalled();
      expect(component.state.imageLoadingAttempts).toBe(0);
      expect(component.state.slides.filter((slide) => slide.loaded)).toHaveLength(0);
      expect(component.state.slides.filter((slide) => (
        slide.image !== `http://localhost:8080/v1/images/${slide.id}?width=100&height=200`
      ))).toHaveLength(0);
    });

    it("updates slides with image falling back to desktop image", () => {
      componentDidUpdate.mockImplementation(() => {});
      const component = new ComponentHandler(<Component {...props} />);
      props.getOption.mockImplementationOnce(() => "http://localhost:8080");
      component.instance.container = {clientHeight: 0, clientWidth: 0};
      component.instance.fetchImages = jest.fn().mockName("fetchImages");
      component.instance.resizeImages();

      expect(component.instance.fetchImages).toHaveBeenCalled();
      expect(component.state.imageLoadingAttempts).toBe(0);
      expect(component.state.slides.filter((slide) => slide.loaded)).toHaveLength(0);
      expect(component.state.slides.filter((slide) => (
        slide.image !== slide.image_desktop
      ))).toHaveLength(0);
    });
  });

  describe("finish", () => {
    let componentDidUpdate;

    beforeAll(() => {
      componentDidUpdate = jest.spyOn(Component.prototype, "componentDidUpdate");
      componentDidUpdate.mockImplementation(() => {});
    });

    beforeEach(() => {
      props.traitify.put.mockResolvedValue(Promise.resolve());
    });

    afterAll(() => {
      componentDidUpdate.mockRestore();
    });

    it("does nothing if finished", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({finished: true});
      setState.mockClear();
      component.instance.finish();

      expect(props.traitify.put).not.toHaveBeenCalled();
      expect(setState).not.toHaveBeenCalled();
    });

    it("does nothing if results ready", () => {
      const component = new ComponentHandler(<Component {...props} />);
      setState.mockClear();
      component.props.isReady.mockImplementation(() => true);
      component.instance.finish();

      expect(component.props.traitify.put).not.toHaveBeenCalled();
      expect(setState).toHaveBeenCalledWith({finished: true});
    });

    it("submits results", (done) => {
      const component = new ComponentHandler(<Component {...props} />);
      const slides = assessment.slides.map(({id}) => ({id, response: true, time_taken: 600}));
      setState.mockClear();
      completedSlides.mockReturnValueOnce(slides);
      component.props.traitify.put.mockResolvedValueOnce(Promise.resolve({status: "success"}));
      component.instance.finish();

      props.traitify.put.mock.results[0].value.then(() => {
        expect(props.getAssessment).toHaveBeenCalledWith({force: true});
        expect(props.traitify.put).toHaveBeenCalledWith(
          `/assessments/${component.props.assessmentID}/slides`,
          slides
        );
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.finished", component.instance, {status: "success"});
        expect(setState).toHaveBeenCalledWith({finished: true});
        done();
      });
    });
  });

  describe("actions", () => {
    let componentDidUpdate;

    beforeAll(() => {
      componentDidUpdate = jest.spyOn(Component.prototype, "componentDidUpdate");
      componentDidUpdate.mockImplementation(() => {});
    });

    afterAll(() => {
      componentDidUpdate.mockRestore();
    });

    describe("back", () => {
      it("updates slides", () => {
        const component = new ComponentHandler(<Component {...props} />);
        const {startTime, slides} = component.state;
        component.updateState({
          slides: slides.map((slide, index) => ({
            ...slide,
            response: index > slides.length / 2 ? null : true
          }))
        });
        const previousLength = completedSlides(component.state.slides).length;
        component.instance.fetchImages = jest.fn().mockName("fetchImages");
        component.instance.back();

        expect(completedSlides(component.state.slides)).toHaveLength(previousLength - 1);
        expect(component.state.startTime).not.toBe(startTime);
        expect(component.instance.fetchImages).toHaveBeenCalled();
      });
    });

    describe("hideInstructions", () => {
      it("updates state", () => {
        const component = new ComponentHandler(<Component {...props} />);
        component.updateState({showInstructions: true});
        component.instance.hideInstructions();

        expect(component.state.showInstructions).toBe(false);
      });
    });

    describe("retry", () => {
      it("updates state and fetches images", () => {
        const component = new ComponentHandler(<Component {...props} />);
        component.instance.fetchImages = jest.fn().mockName("fetchImages");
        component.updateState({imageLoadingAttempts: 3});
        component.instance.retry();

        expect(component.state.imageLoadingAttempts).toBe(0);
        expect(component.instance.fetchImages).toHaveBeenCalled();
      });
    });

    describe("toggleFullscreen", () => {
      it("updates state and triggers callback", () => {
        const component = new ComponentHandler(<Component {...props} />);
        toggleFullscreen.mockImplementationOnce(() => {});
        component.instance.toggleFullscreen();

        expect(component.state.isFullscreen).toBe(true);
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.fullscreen", component.instance, true);
        expect(toggleFullscreen).toHaveBeenCalledWith({
          current: false,
          element: component.instance.container
        });
      });
    });

    describe("updateSlide", () => {
      it("updates slides", () => {
        const component = new ComponentHandler(<Component {...props} />);
        const {startTime, slides} = component.state;
        component.updateState({
          slides: slides.map((slide, index) => ({
            ...slide,
            response: index > slides.length / 2 ? null : true
          }))
        });
        const previousLength = completedSlides(component.state.slides).length;
        const lastSlide = {...component.state.slides[previousLength]};
        component.instance.finish = jest.fn().mockName("finish");
        component.instance.updateSlide(previousLength, false);

        expect(completedSlides(component.state.slides)).toHaveLength(previousLength + 1);
        expect(component.state.slides[previousLength]).toEqual({
          ...lastSlide,
          response: false,
          time_taken: expect.any(Number)
        });
        expect(component.state.startTime).not.toBe(startTime);
        expect(component.instance.finish).not.toHaveBeenCalled();
      });

      it("finishes", () => {
        const component = new ComponentHandler(<Component {...props} />);
        const {slides} = component.state;
        component.updateState({
          slides: slides.map((slide, index) => ({
            ...slide,
            response: index === slides.length - 1 ? null : false
          }))
        });
        const previousLength = completedSlides(component.state.slides).length;
        const lastSlide = {...component.state.slides[previousLength]};
        component.instance.finish = jest.fn().mockName("finish");
        component.instance.updateSlide(previousLength, true);

        expect(completedSlides(component.state.slides)).toHaveLength(previousLength + 1);
        expect(component.state.slides[previousLength]).toEqual({
          ...lastSlide,
          response: true,
          time_taken: expect.any(Number)
        });
        expect(component.instance.finish).toHaveBeenCalled();
      });
    });
  });

  it("renders component", () => {
    isFinished.mockReturnValue(false);
    isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation(() => true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading if finished", () => {
    finish.mockImplementation(() => {});
    isFinished.mockReturnValue(true);
    isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders loading if not ready", () => {
    isFinished.mockReturnValue(false);
    isReady.mockReturnValue(false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
