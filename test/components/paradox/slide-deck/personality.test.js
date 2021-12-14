/* eslint-disable max-len, no-unused-vars, jest/no-focused-tests */
import {useState} from "react";
import {Component} from "components/paradox/slide-deck/personality";
import {times} from "lib/helpers/array";
import useFullscreen from "lib/hooks/use-fullscreen";
import ComponentHandler, {act} from "support/component-handler";
import {flushPromises, mockOptions} from "support/helpers";
import useGlobalMock from "support/hooks/use-global-mock";
import assessment from "support/json/assessment/with-slides.json";

jest.mock("lib/hooks/use-fullscreen", () => jest.fn().mockName("useFullscreen").mockReturnValue([]));
jest.mock("lib/helpers/icon", () => (({alt, className, icon}) => <span {...{alt, className}}>{icon.iconName}</span>));
jest.mock("lib/with-traitify", () => ((value) => value));

const createNodeMock = () => ({
  clientHeight: 800,
  clientWidth: 600,
  focus: jest.fn().mockName("focus")
});

describe("Personality", () => {
  let component;
  let elements;
  let options;
  let props;
  const getCurrentImage = () => {
    const images = elements.filter(({firstChild}) => firstChild.nodeName === "img");

    return images[images.length - 1];
  };
  const lastUpdate = () => props.ui.trigger.mock.calls[props.ui.trigger.mock.calls.length - 1][1];

  useGlobalMock(document, "createElement");

  beforeEach(() => {
    elements = [];
    document.createElement.mockImplementation((tag) => {
      const element = {
        clientHeight: 800,
        clientWidth: 600,
        firstChild: {nodeName: tag}
      };
      elements.push(element);

      return element;
    });

    options = {imageHost: "img.com"};
    props = {
      assessment,
      cache: {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      },
      getAssessment: jest.fn().mockName("getAssessment"),
      getCacheKey: jest.fn().mockName("getCacheKey").mockImplementation((key) => key),
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockImplementation(() => false),
      setElement: jest.fn().mockName("setElement"),
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

    mockOptions(props.getOption, {...options});
  });

  describe("actions", () => {
    describe("back", () => {
      beforeEach(() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        mockOptions(props.getOption, {allowBack: true, ...options});

        times(5).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });
      });

      it("requires answered slides", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("shows button", () => {
        component.act(() => { component.findByText("me").props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });

      it("triggers action", () => {
        component.act(() => { component.findByText("me").props.onClick(); });
        component.act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("fullscreen", () => {
      beforeEach(() => {
        useFullscreen.mockImplementation(() => {
          const [fullscreen, setFullscreen] = useState(false);

          return [fullscreen, () => setFullscreen(!fullscreen)];
        });
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        mockOptions(props.getOption, {allowFullscreen: true, ...options});

        times(5).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });
      });

      it("shows button", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("triggers action", () => {
        component.act(() => { component.base.findByProps({className: "fullscreen"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.fullscreen", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }), true);
      });

      it("untriggers action", () => {
        component.act(() => { component.base.findByProps({className: "fullscreen"}).props.onClick(); });
        component.act(() => { component.base.findByProps({className: "fullscreen"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.fullscreen", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }), false);
      });
    });

    describe("response", () => {
      beforeEach(() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        times(5).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });
      });

      it("saves me", () => {
        component.act(() => { component.findByText("me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.me", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe(true);
        expect(component.tree).toMatchSnapshot();
      });

      it("saves not me", () => {
        component.act(() => { component.findByText("not_me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.notMe", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe(false);
        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.initialized", expect.objectContaining({
        props: expect.any(Object),
        state: expect.any(Object)
      }));
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.updated", expect.objectContaining({
        props: expect.any(Object),
        state: expect.any(Object)
      }));
    });
  });

  describe("image", () => {
    describe("error", () => {
      beforeEach(() => {
        jest.useFakeTimers();

        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        times(4).forEach(() => {
          component.act(() => { getCurrentImage().onerror(); });
          component.act(() => { jest.advanceTimersByTime(2000); });
        });
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      describe("retry", () => {
        beforeEach(() => {
          component.act(() => { component.findByText("try_again").props.onClick(); });
        });

        it("renders loading", () => {
          expect(component.tree).toMatchSnapshot();
          expect(lastUpdate().state.error).toBeNull();
        });

        it("renders slide", () => {
          times(3).forEach(() => {
            component.act(() => { getCurrentImage().onload(); });
          });

          expect(component.tree).toMatchSnapshot();
        });
      });

      it("renders error", () => {
        expect(component.tree).toMatchSnapshot();
        expect(lastUpdate().state.error).toBe("slide_error");
      });
    });

    describe("loading", () => {
      it("renders loading", () => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        expect(component.tree).toMatchSnapshot();
      });

      it("requires multiple loaded slides", () => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        times(2).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("loads", () => {
      it("renders slide", () => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        times(3).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });

        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  describe("instructions", () => {
    let instructions;

    beforeEach(() => {
      instructions = {instructional_text: "# Listen Up\n\nClick the buttons"};
    });

    it("renders instructions", () => {
      mockOptions(props.getOption, {allowInstructions: true, ...options});
      props.assessment = {...assessment, instructions};
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("requires instructions", () => {
      mockOptions(props.getOption, {allowInstructions: true, ...options});
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("requires option", () => {
      props.assessment = {...assessment, instructions};
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("starts assessment", () => {
      mockOptions(props.getOption, {allowInstructions: true, ...options});
      props.assessment = {...assessment, instructions};
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.act(() => { component.findByText("get_started").props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("likert", () => {
    beforeEach(() => {
      props.assessment = {...assessment, scoring_scale: "LIKERT_CUMULATIVE_POMP"};
    });

    describe("setup", () => {
      it("resets state", () => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        const {state} = lastUpdate();

        expect(state).toMatchObject({
          finished: false,
          ready: false,
          slideIndex: 0,
          slides: expect.any(Array)
        });
        expect(state.slides[0]).toMatchObject({
          caption: expect.any(String),
          id: expect.any(String),
          image: expect.stringContainingAll("w=600", "h=800"),
          loaded: false,
          response: null,
          time_taken: null
        });
      });
    });

    describe("response", () => {
      beforeEach(() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});

        times(5).forEach(() => {
          component.act(() => { getCurrentImage().onload(); });
        });
      });

      it("saves me", () => {
        component.act(() => { component.findByText("me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.likert.me", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves not me", () => {
        component.act(() => { component.findByText("not_me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.likert.notMe", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("NOT_ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves really me", () => {
        component.act(() => { component.findByText("really_me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.likert.reallyMe", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("REALLY_ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves really not me", () => {
        component.act(() => { component.findByText("really_not_me").props.onClick(); });
        const {state} = lastUpdate();

        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.likert.reallyNotMe", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("REALLY_NOT_ME");
        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("submit", () => {
      const completeSlides = async() => {
        const slideCount = assessment.slides.length;

        times(slideCount).forEach(() => component.act(() => { getCurrentImage().onload(); }));
        times(slideCount).forEach((index) => {
          component.act(() => {
            const text = ["really_not_me", "not_me", "me", "really_me"][index % 4];

            component.findByText(text).props.onClick();
          });
        });

        await flushPromises();
      };

      let currentTime;
      const originalNow = useGlobalMock(Date, "now");

      beforeEach(() => {
        jest.useFakeTimers();
        Date.now = Date.now.mockImplementation(() => {
          currentTime = currentTime ? currentTime + 600 : originalNow();

          return currentTime;
        });
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("submits results", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.props.traitify.put.mockResolvedValueOnce({status: "success"});

        await completeSlides();

        expect(props.getAssessment).toHaveBeenCalledWith({force: true});
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.finished", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }), {status: "success"});

        expect(props.traitify.put).toMatchSnapshot();
      });
    });
  });

  describe("setup", () => {
    it("does nothing if no slides", () => {
      props.assessment = null;
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.updateProps({assessment: {...assessment, slides: []}});
      const {state} = lastUpdate();

      expect(props.cache.get).not.toHaveBeenCalled();
      expect(state.finished).toBe(false);
      expect(state.ready).toBe(false);
      expect(state.slideIndex).toBe(-1);
    });

    it("resets state", () => {
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      const {state} = lastUpdate();

      expect(state).toMatchObject({
        finished: false,
        ready: false,
        slideIndex: 0,
        slides: expect.any(Array)
      });
      expect(state.slides[0]).toMatchObject({
        caption: expect.any(String),
        id: expect.any(String),
        image: expect.stringContainingAll("w=600", "h=800"),
        loaded: false,
        response: null,
        time_taken: null
      });
    });

    it("uses cache", () => {
      const cachedSlides = props.assessment.slides.slice(0, 2)
        .map(({id}, index) => ({id, response: index === 0, time_taken: 200}));
      props.cache.get.mockReturnValue({slides: cachedSlides});
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      const {state} = lastUpdate();

      expect(state).toMatchObject({
        finished: false,
        ready: false,
        slideIndex: 2,
        slides: expect.any(Array)
      });
      expect(state.slides.slice(0, 3)).toEqual([
        expect.objectContaining({
          caption: expect.any(String),
          id: cachedSlides[0].id,
          image: expect.stringContainingAll("w=600", "h=800"),
          loaded: false,
          response: true,
          time_taken: 200
        }),
        expect.objectContaining({
          caption: expect.any(String),
          id: cachedSlides[1].id,
          image: expect.stringContainingAll("w=600", "h=800"),
          loaded: false,
          response: false,
          time_taken: 200
        }),
        expect.objectContaining({
          caption: expect.any(String),
          id: expect.any(String),
          image: expect.stringContainingAll("w=600", "h=800"),
          loaded: false,
          response: null,
          time_taken: null
        })
      ]);
    });
  });

  describe("submit", () => {
    const completeSlides = async() => {
      const slideCount = assessment.slides.length;

      times(slideCount).forEach(() => component.act(() => { getCurrentImage().onload(); }));
      times(slideCount).forEach((index) => {
        component.act(() => {
          component.findByText(index > slideCount / 2 ? "me" : "not_me").props.onClick();
        });
      });

      await flushPromises();
    };

    let currentTime;
    const originalNow = useGlobalMock(Date, "now");

    beforeEach(() => {
      jest.useFakeTimers();
      Date.now = Date.now.mockImplementation(() => {
        currentTime = currentTime ? currentTime + 600 : originalNow();

        return currentTime;
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("does nothing if not finished", () => {
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(props.traitify.put).not.toHaveBeenCalled();
    });

    it("does nothing if results ready", () => {
      const slides = props.assessment.slides
        .map(({id}, index) => ({id, response: index === 0, time_taken: 200}));
      props.cache.get.mockReturnValue({slides});
      props.isReady.mockReturnValue(true);
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});

      expect(component.props.traitify.put).not.toHaveBeenCalled();
    });

    it("submits results", async() => {
      component = new ComponentHandler(<Component {...props} />, {createNodeMock});
      component.props.traitify.put.mockResolvedValueOnce({status: "success"});

      await completeSlides();

      expect(props.getAssessment).toHaveBeenCalledWith({force: true});
      expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.finished", expect.objectContaining({
        props: expect.any(Object),
        state: expect.any(Object)
      }), {status: "success"});

      expect(props.traitify.put).toMatchSnapshot();
    });

    describe("errors", () => {
      const retry = async() => {
        await act(async() => { jest.advanceTimersByTime(2000); });
      };

      it("automatically retries request", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.act(() => { component.props.traitify.put.mockRejectedValueOnce(`{"errors": ["Oh no", "Not good"]}`); });
        component.act(() => { component.props.traitify.put.mockResolvedValueOnce({status: "success"}); });

        await completeSlides();
        await retry();

        expect(props.getAssessment).toHaveBeenCalledWith({force: true});
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.finished", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }), {status: "success"});
        expect(props.traitify.put).toHaveBeenCalledTimes(2);
        expect(props.traitify.put).toMatchSnapshot();
      });

      it("renders default error", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.act(() => { component.props.traitify.put.mockRejectedValue(); });

        await completeSlides();
        await retry();
        await retry();

        expect(props.getAssessment).not.toHaveBeenCalled();
        expect(props.traitify.put).toHaveBeenCalledTimes(3);
        expect(component).toMatchSnapshot();
      });

      it("renders json error", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.act(() => { component.props.traitify.put.mockRejectedValue(`{"errors": ["Oh no", "Not good"]}`); });

        await completeSlides();
        await retry();
        await retry();

        expect(props.getAssessment).not.toHaveBeenCalled();
        expect(props.traitify.put).toHaveBeenCalledTimes(3);
        expect(component).toMatchSnapshot();
      });

      it("renders text error", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.act(() => { component.props.traitify.put.mockRejectedValue("Oh no"); });

        await completeSlides();
        await retry();
        await retry();

        expect(props.getAssessment).not.toHaveBeenCalled();
        expect(props.traitify.put).toHaveBeenCalledTimes(3);
        expect(component).toMatchSnapshot();
      });

      it("retries", async() => {
        component = new ComponentHandler(<Component {...props} />, {createNodeMock});
        component.act(() => { component.props.traitify.put.mockRejectedValue("Oh no"); });

        await completeSlides();
        await retry();
        await retry();

        component.act(() => { component.props.traitify.put.mockResolvedValueOnce({status: "success"}); });
        component.act(() => { component.findByText("try_again").props.onClick(); });

        await flushPromises();

        expect(props.getAssessment).toHaveBeenCalledWith({force: true});
        expect(props.ui.trigger).toHaveBeenCalledWith("SlideDeck.finished", expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        }), {status: "success"});
        expect(props.traitify.put).toHaveBeenCalledTimes(4);
      });
    });
  });

  it("renders nothing if results ready", () => {
    props.isReady.mockReturnValue(true);
    component = new ComponentHandler(<Component {...props} />, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
  });
});
