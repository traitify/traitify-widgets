/** @jest-environment jsdom */
import {useState} from "react";
import {act} from "react-test-renderer";
import Component from "components/survey/personality";
import times from "lib/common/array/times";
import getCacheKey from "lib/common/get-cache-key";
import mutable from "lib/common/object/mutable";
import useFullscreen from "lib/hooks/use-fullscreen";
import ComponentHandler from "support/component-handler";
import {
  mockAssessment,
  mockAssessmentSkip,
  mockAssessmentStarted,
  mockAssessmentSubmit,
  mockSettings,
  useSettings
} from "support/container/http";
import {mockOption, useOption} from "support/container/options";
import _completedAssessment from "support/data/assessment/personality/completed";
import _assessment from "support/data/assessment/personality/incomplete";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";

jest.mock("components/common/icon", () => (({alt, className, icon}) => <span {...{alt, className}}>{icon.iconName}</span>));
jest.mock("lib/hooks/use-fullscreen", () => jest.fn().mockName("useFullscreen").mockReturnValue([false, () => {}]));

const createNodeMock = () => ({
  clientHeight: 800,
  clientWidth: 600,
  focus: jest.fn().mockName("focus")
});

describe("Survey.Personality", () => {
  let assessment;
  let cacheKey;
  let completedAssessment;
  let component;
  let elements;
  let options;
  const getCurrentImage = () => {
    const images = elements.filter(({firstChild}) => firstChild.nodeName === "img");

    return images[images.length - 1];
  };
  const lastUpdate = () => (
    container.listener.trigger.mock.calls[container.listener.trigger.mock.calls.length - 1][1]
  );

  useContainer();
  useGlobalMock(document, "createElement");
  useSettings({});

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    cacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us", scope: ["slides"]});
    completedAssessment = {...mutable(_completedAssessment), id: assessment.id};
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

    options = {};

    mockAssessment(assessment);
  });

  describe("actions", () => {
    describe("back", () => {
      useOption("survey", {...options, allowBack: true});

      beforeEach(async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(5).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });
      });

      it("requires answered slides", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("shows button", () => {
        act(() => { component.findByText("Me").props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });

      it("triggers action", () => {
        act(() => { component.findByText("Me").props.onClick(); });
        act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("fullscreen", () => {
      beforeEach(async() => {
        mockOption("survey", {...options, allowFullscreen: true});
        useFullscreen.mockImplementation(() => {
          const [fullscreen, setFullscreen] = useState(false);

          return [fullscreen, () => setFullscreen(!fullscreen)];
        });
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(5).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });
      });

      it("shows button", () => {
        expect(component.tree).toMatchSnapshot();
      });

      it("triggers action", () => {
        act(() => { component.instance.findByProps({className: "fullscreen"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });

      it("untriggers action", () => {
        act(() => { component.instance.findByProps({className: "fullscreen"}).props.onClick(); });
        act(() => { component.instance.findByProps({className: "fullscreen"}).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("response", () => {
      beforeEach(async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(5).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });
      });

      it("saves me", () => {
        act(() => { component.findByText("Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: true
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe(true);
        expect(component.tree).toMatchSnapshot();
      });

      it("saves not me", () => {
        act(() => { component.findByText("Not Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: false
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe(false);
        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component, {createNodeMock});

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.initialized",
        expect.any(Object)
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component, {createNodeMock});
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.updated",
        expect.any(Object)
      );
    });
  });

  describe("image", () => {
    describe("error", () => {
      beforeEach(async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(4).forEach(() => {
          act(() => { getCurrentImage().onerror(); });
          act(() => { jest.advanceTimersByTime(2000); });
        });
      });

      describe("retry", () => {
        beforeEach(() => {
          act(() => { component.findByText("Click Here to Try Again").props.onClick(); });
        });

        it("renders loading", () => {
          expect(component.tree).toMatchSnapshot();
          expect(lastUpdate().error).toBeNull();
        });

        it("renders slide", () => {
          times(3).forEach(() => {
            act(() => { getCurrentImage().onload(); });
          });

          expect(component.tree).toMatchSnapshot();
        });
      });

      it("renders error", () => {
        expect(component.tree).toMatchSnapshot();
        expect(lastUpdate().error).toBe("Unable to load more slides at this time");
      });
    });

    describe("loading", () => {
      it("renders loading", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        expect(component.tree).toMatchSnapshot();
      });

      it("requires multiple loaded slides", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(2).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });

        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("loads", () => {
      it("renders slide", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(3).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });

        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  describe("instructions", () => {
    let instructions;

    beforeEach(() => {
      instructions = {instructional_text: "# Listen Up\n\nClick the buttons"};
      options = {...options, showInstructions: true};

      mockAssessment({...assessment, instructions});
      mockOption("survey", {...options});
    });

    describe("skip assessment accommodation", () => {
      beforeEach(() => {
        mockSettings({skip_assessment_accommodation: true});
      });

      it("renders instructions", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        expect(component.tree).toMatchSnapshot();
      });

      it("renders request accommodation text", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        act(() => { component.findByText("Request Accommodation").props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });

      it("renders back action", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        act(() => { component.findByText("Request Accommodation").props.onClick(); });
        act(() => { component.findByText("Back").props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });

      it("triggers accommodation request", async() => {
        const mock = mockAssessmentSkip({skipped: true});
        component = await ComponentHandler.setup(Component, {createNodeMock});
        act(() => { component.findByText("Request Accommodation").props.onClick(); });
        await act(async() => { component.findByText("Yes, Request Accommodation").props.onClick(); });

        expect(mock.called).toBe(1);
      });

      it("triggers start assessment", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        act(() => { component.findByText("Get Started").props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });
    });

    it("renders html instructions", async() => {
      instructions = {instructional_html: "<p>Listen Up<br /><br />Click the buttons</p>"};
      mockAssessment({...assessment, instructions});
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("renders markdown instructions", async() => {
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("requires instructions", async() => {
      mockAssessment({...assessment, instructions: null});
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("requires option", async() => {
      mockOption("survey", {...options, showInstructions: false});
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(component.tree).toMatchSnapshot();
    });

    it("starts assessment", async() => {
      component = await ComponentHandler.setup(Component, {createNodeMock});
      act(() => { component.findByText("Get Started").props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("likert", () => {
    beforeEach(() => {
      mockAssessment({...assessment, scoring_scale: "LIKERT_CUMULATIVE_POMP"});
    });

    describe("setup", () => {
      it("resets state", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const state = lastUpdate();

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
      beforeEach(async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});

        times(5).forEach(() => {
          act(() => { getCurrentImage().onload(); });
        });
      });

      it("saves me", () => {
        act(() => { component.findByText("Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: "ME"
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves not me", () => {
        act(() => { component.findByText("Not Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: "NOT_ME"
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("NOT_ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves really me", () => {
        act(() => { component.findByText("Really Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: "REALLY_ME"
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("REALLY_ME");
        expect(component.tree).toMatchSnapshot();
      });

      it("saves really not me", () => {
        act(() => { component.findByText("Really Not Me").props.onClick(); });
        const state = lastUpdate();

        expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
          response: "REALLY_NOT_ME"
        }));
        expect(state.slideIndex).toBe(1);
        expect(state.slides[0].response).toBe("REALLY_NOT_ME");
        expect(component.tree).toMatchSnapshot();
      });
    });

    describe("submit", () => {
      const completeSlides = async() => {
        const slideCount = assessment.slides.length;

        times(slideCount).forEach(() => act(() => { getCurrentImage().onload(); }));
        times(slideCount).forEach((index) => {
          act(() => {
            const text = ["Really Not Me", "Not Me", "Me", "Really Me"][index % 4];

            jest.advanceTimersByTime(600);
            component.findByText(text).props.onClick();
          });
        });

        await act(async() => { jest.runOnlyPendingTimers(); });
      };

      it("submits results", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mock = mockAssessmentSubmit({status: "success"});

        await completeSlides();

        expect(mock.called).toBe(1);
      });
    });
  });

  describe("setup", () => {
    it("does nothing if no slides", async() => {
      mockAssessment({...assessment, slides: []});
      component = await ComponentHandler.setup(Component, {createNodeMock});
      const state = lastUpdate();

      expect(container.cache.get).not.toHaveBeenCalledWith(cacheKey);
      expect(state.finished).toBe(false);
      expect(state.ready).toBe(false);
      expect(state.slideIndex).toBe(-1);
    });

    it("resets state", async() => {
      component = await ComponentHandler.setup(Component, {createNodeMock});
      const state = lastUpdate();

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

    it("sets started_at", async() => {
      assessment.started_at = null;
      mockAssessment(assessment);
      const mock = mockAssessmentStarted();
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(mock.called).toBe(1);
    });

    it("uses cache", async() => {
      const cachedSlides = assessment.slides.slice(0, 2)
        .map(({id}, index) => ({id, response: index === 0, time_taken: 200}));
      container.cache.set(cacheKey, {slides: cachedSlides});
      component = await ComponentHandler.setup(Component, {createNodeMock});
      const state = lastUpdate();

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

      times(slideCount).forEach(() => act(() => { getCurrentImage().onload(); }));
      times(slideCount).forEach((index) => {
        act(() => {
          jest.advanceTimersByTime(600);
          component.findByText(index > slideCount / 2 ? "Me" : "Not Me").props.onClick();
        });
      });

      await act(async() => { jest.runOnlyPendingTimers(); });
    };

    it("does nothing if not finished", async() => {
      const mock = mockAssessmentSubmit();
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(mock.called).toBe(0);
    });

    it("does nothing if results ready", async() => {
      const mock = mockAssessmentSubmit();
      const slides = assessment.slides
        .map(({id}, index) => ({id, response: index === 0, time_taken: 200}));
      container.cache.set(cacheKey, {slides});
      mockAssessment(completedAssessment);
      component = await ComponentHandler.setup(Component, {createNodeMock});

      expect(mock.called).toBe(0);
    });

    it("submits results", async() => {
      component = await ComponentHandler.setup(Component, {createNodeMock});
      const mock = mockAssessmentSubmit({status: "success"});

      await completeSlides();

      expect(mock.called).toBe(1);
    });

    describe("errors", () => {
      const retry = async() => {
        await act(async() => { jest.runOnlyPendingTimers(); });
      };

      it("automatically retries request", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mockError = mockAssessmentSubmit({implementation: () => Promise.reject(`{"errors": ["Oh no", "Not good"]}`)});
        await completeSlides();
        const mock = mockAssessmentSubmit({status: "success"});
        await retry();

        expect(mockError.called).toBe(1);
        expect(mock.called).toBe(1);
      });

      it("renders default error", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mock = mockAssessmentSubmit({implementation: () => Promise.reject()});

        await completeSlides();
        await retry();
        await retry();

        expect(mock.called).toBe(3);
        expect(component).toMatchSnapshot();
      });

      it("renders json error", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mock = mockAssessmentSubmit({implementation: () => Promise.reject(`{"errors": ["Oh no", "Not good"]}`)});

        await completeSlides();
        await retry();
        await retry();

        expect(mock.called).toEqual(3);
        expect(component).toMatchSnapshot();
      });

      it("renders text error", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mock = mockAssessmentSubmit({implementation: () => Promise.reject("Oh no")});

        await completeSlides();
        await retry();
        await retry();

        expect(mock.called).toEqual(3);
        expect(component).toMatchSnapshot();
      });

      it("retries", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mockError = mockAssessmentSubmit({implementation: () => Promise.reject("Oh no")});

        await completeSlides();
        await retry();
        await retry();

        const mock = mockAssessmentSubmit({status: "success"});
        act(() => { component.findByText("Click Here to Try Again").props.onClick(); });

        await act(async() => { await jest.runOnlyPendingTimers(); });

        expect(mockError.called).toEqual(3);
        expect(mock.called).toEqual(1);
      });
    });
  });

  describe("text survey", () => {
    beforeEach(() => {
      assessment = mutable(_assessment);
      assessment.slide_type = "TEXT";

      mockAssessment(assessment);
    });

    describe("actions", () => {
      describe("response", () => {
        beforeEach(async() => {
          component = await ComponentHandler.setup(Component, {createNodeMock});
        });

        it("saves me", () => {
          act(() => { component.findByText("Me").props.onClick(); });
          const state = lastUpdate();

          expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
            response: true
          }));
          expect(state.slideIndex).toBe(1);
          expect(state.slides[0].response).toBe(true);
          expect(component.tree).toMatchSnapshot();
        });

        it("saves not me", () => {
          act(() => { component.findByText("Not Me").props.onClick(); });
          const state = lastUpdate();

          expect(container.listener.trigger).toHaveBeenCalledWith("Survey.updateSlide", expect.objectContaining({
            response: false
          }));
          expect(state.slideIndex).toBe(1);
          expect(state.slides[0].response).toBe(false);
          expect(component.tree).toMatchSnapshot();
        });
      });
    });

    describe("submit", () => {
      const completeSlides = async() => {
        const slideCount = assessment.slides.length;

        times(slideCount).forEach((index) => {
          act(() => {
            jest.advanceTimersByTime(600);
            component.findByText(index > slideCount / 2 ? "Me" : "Not Me").props.onClick();
          });
        });

        await act(async() => { jest.runOnlyPendingTimers(); });
      };

      it("submits results", async() => {
        component = await ComponentHandler.setup(Component, {createNodeMock});
        const mock = mockAssessmentSubmit({status: "success"});

        await completeSlides();

        expect(mock.called).toBe(1);
      });

      describe("errors", () => {
        const retry = async() => {
          await act(async() => { jest.runOnlyPendingTimers(); });
        };

        it("renders error", async() => {
          component = await ComponentHandler.setup(Component, {createNodeMock});
          const mock = mockAssessmentSubmit({implementation: () => Promise.reject()});

          await completeSlides();
          await retry();
          await retry();

          expect(mock.called).toBe(3);
          expect(component).toMatchSnapshot();
        });

        it("retries", async() => {
          component = await ComponentHandler.setup(Component, {createNodeMock});
          const mockError = mockAssessmentSubmit({implementation: () => Promise.reject("Oh no")});

          await completeSlides();
          await retry();
          await retry();

          const mock = mockAssessmentSubmit({status: "success"});
          act(() => { component.findByText("Click Here to Try Again").props.onClick(); });

          await act(async() => { await jest.runOnlyPendingTimers(); });

          expect(mockError.called).toEqual(3);
          expect(mock.called).toEqual(1);
        });
      });
    });
  });

  it("renders nothing if results ready", async() => {
    mockAssessment(completedAssessment);
    component = await ComponentHandler.setup(Component, {createNodeMock});

    expect(component.tree).toMatchSnapshot();
  });
});
