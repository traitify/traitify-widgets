/** @jest-environment jsdom */
import {createRef, useReducer} from "react";
import useSlideLoader, {reduceActions, reducer} from "lib/hooks/use-slide-loader";
import {except, remap, slice} from "lib/helpers/object";
import ComponentHandler from "support/component-handler";
import useGlobalMock from "support/hooks/use-global-mock";
import useResizeMock from "support/hooks/use-resize-mock";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useReducer: jest.fn().mockName("useReducer")
}));

describe("useSlideLoader", () => {
  const baseImageURL = "https://via.placeholder.com/150";
  let createdSlideCount;
  const maxRetries = 3;
  const createSlide = (props = {}) => {
    createdSlideCount += 1;

    return {
      id: createdSlideCount,
      image: `${baseImageURL}?index=${createdSlideCount}`,
      loaded: false,
      ...props
    };
  };

  describe("hook", () => {
    let dispatch;
    let elements;
    let state;

    function Component(props) {
      state.current = useSlideLoader(props);

      return null;
    }

    useGlobalMock(document, "createElement");

    beforeEach(() => {
      createdSlideCount = 0;
      dispatch = jest.fn().mockName("dispatch");
      elements = [];
      state = createRef(null);
      useReducer.mockImplementation((_, initialState) => [initialState, dispatch]);

      document.createElement.mockImplementation((tag) => {
        const element = {clientHeight: 800, clientWidth: 600, firstChild: {nodeName: tag}};
        elements.push(element);

        return element;
      });
    });

    it("returns current state", () => {
      new ComponentHandler(<Component />);

      expect(state.current).toEqual({
        error: null,
        dispatch: expect.any(Function),
        ready: false,
        slideIndex: -1,
        slides: []
      });
    });

    describe("error", () => {
      it("dispatches error", () => {
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts: maxRetries + 1},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).toHaveBeenCalledWith({error: "slide_error", type: "error"});
      });

      it("skips if not enought attempts", () => {
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts: maxRetries},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).not.toHaveBeenCalledWith({error: "slide_error", type: "error"});
      });
    });

    describe("loading", () => {
      let imageLoading;
      let imageLoadingAttempts;
      let slides;
      const getCurrentImage = () => {
        const images = elements.filter(({firstChild}) => firstChild.nodeName === "img");

        return images[images.length - 1];
      };

      beforeEach(() => {
        jest.useFakeTimers();
        imageLoading = false;
        imageLoadingAttempts = maxRetries;
        slides = [createSlide({loaded: true}), createSlide({loaded: false})];
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it("dispatches error", () => {
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts, slides},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        getCurrentImage().onerror();

        expect(dispatch).toHaveBeenCalledWith({image: slides[1].image, type: "imageLoading"});
        expect(dispatch).not.toHaveBeenCalledWith({image: slides[1].image, type: "imageError"});

        jest.advanceTimersByTime(3000);

        expect(dispatch).toHaveBeenCalledWith({image: slides[1].image, type: "imageError"});
      });

      it("dispatches loaded", () => {
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts, slides},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).toHaveBeenCalledWith({image: slides[1].image, type: "imageLoading"});
        expect(dispatch).not.toHaveBeenCalledWith({image: slides[1].image, type: "imageLoaded"});

        getCurrentImage().onload();

        expect(dispatch).toHaveBeenCalledWith({image: slides[1].image, type: "imageLoaded"});
      });

      it("skips if all the slides loaded", () => {
        slides = [createSlide({loaded: true}), createSlide({loaded: true})];
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts, slides},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).not.toHaveBeenCalledWith({image: expect.any(String), type: "imageLoading"});
      });

      it("skips if image loading", () => {
        imageLoading = true;
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoading, imageLoadingAttempts, slides},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).not.toHaveBeenCalledWith({image: expect.any(String), type: "imageLoading"});
      });

      it("skips if too many attempts", () => {
        imageLoadingAttempts = maxRetries + 1;
        useReducer.mockImplementation((_, initialState) => [
          {...initialState, imageLoadingAttempts, slides},
          dispatch
        ]);
        new ComponentHandler(<Component translate={(key) => key} />);

        expect(dispatch).not.toHaveBeenCalledWith({image: expect.any(String), type: "imageLoading"});
      });
    });

    describe("resize", () => {
      useResizeMock();

      it("dispatches initial", () => {
        const element = document.createElement("div");
        new ComponentHandler(<Component element={element} />);

        expect(dispatch).toHaveBeenCalledWith({size: [600, 800], type: "resize"});
      });

      it("dispatches updated size", () => {
        const element = document.createElement("div");
        const component = new ComponentHandler(<Component element={element} />);

        element.clientWidth = 700;
        component.act(() => window.resizeTo(1200, 800));

        expect(dispatch).toHaveBeenCalledWith({size: [700, 800], type: "resize"});
      });
    });
  });

  describe("reduceActions", () => {
    let defaultState;

    const advanceTimeBy = (ms) => {
      jest.advanceTimersByTime(ms);
    };

    beforeEach(() => {
      jest.useFakeTimers();
      defaultState = {error: null, imageLoading: false, imageLoadingAttempts: 0};
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe("answer", () => {
      it("updates state", () => {
        const action = {index: 1, response: false, type: "answer"};
        const slides = [createSlide({loaded: true, response: false}), createSlide({loaded: true})];
        const startTime = Date.now();

        advanceTimeBy(3000);

        const state = reduceActions({...defaultState, slides, startTime}, action);

        expect(state).toEqual({
          error: null,
          imageLoading: false,
          imageLoadingAttempts: 0,
          slides: [
            slides[0],
            {...slides[1], response: false, time_taken: 3000}
          ],
          startTime: Date.now()
        });
      });
    });

    describe("back", () => {
      it("updates state", () => {
        const slides = [
          createSlide({loaded: true, response: false, time_taken: 600}),
          createSlide({loaded: true})
        ];
        const startTime = Date.now();

        advanceTimeBy(3000);

        const state = reduceActions({...defaultState, slides, startTime}, {type: "back"});

        expect(slides[0].response).toEqual(false);
        expect(state).toEqual({
          error: null,
          imageLoading: false,
          imageLoadingAttempts: 0,
          slides: [except(slides[0], ["response", "time_taken"]), slides[1]],
          startTime: startTime + 3000
        });
      });

      it("updates state without slides", () => {
        const slides = [];
        const startTime = Date.now();

        advanceTimeBy(3000);

        const state = reduceActions({...defaultState, slides, startTime}, {type: "back"});

        expect(state).toEqual({
          error: null,
          imageLoading: false,
          imageLoadingAttempts: 0,
          slides: [],
          startTime: startTime + 3000
        });
      });

      it("updates state when all slides have responses", () => {
        const slides = [
          createSlide({loaded: true, response: false, time_taken: 600}),
          createSlide({loaded: true, response: true, time_taken: 700})
        ];
        const startTime = Date.now();

        advanceTimeBy(3000);

        const state = reduceActions({...defaultState, slides, startTime}, {type: "back"});

        expect(slides[1].response).toEqual(true);
        expect(state).toEqual({
          error: null,
          imageLoading: false,
          imageLoadingAttempts: 0,
          slides: [slides[0], except(slides[1], ["response", "time_taken"])],
          startTime: startTime + 3000
        });
      });
    });

    describe("default", () => {
      it("updates state", () => {
        const state = reduceActions(defaultState, {type: "none"});

        expect(state).toEqual(defaultState);
      });
    });

    describe("error", () => {
      it("updates state", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const state = reduceActions({...defaultState, slides}, {error: "oh no", type: "error"});

        expect(state).toEqual({error: "oh no", imageLoading: false, imageLoadingAttempts: 0, slides});
      });
    });

    describe("imageError", () => {
      it("skips old images", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const initialState = {...defaultState, image: slides[1].image, imageLoading: true, slides};
        const state = reduceActions(initialState, {image: slides[0].image, type: "imageError"});

        expect(state).toEqual(initialState);
      });

      it("updates state", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const initialState = {...defaultState, image: slides[1].image, imageLoading: true, slides};
        const state = reduceActions(initialState, {image: slides[1].image, type: "imageError"});

        expect(state).toEqual({
          error: null,
          image: slides[1].image,
          imageLoading: false,
          imageLoadingAttempts: 1,
          slides
        });
      });
    });

    describe("imageLoaded", () => {
      it("skips old images", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const initialState = {...defaultState, image: slides[1].image, imageLoading: true, slides};
        const state = reduceActions(initialState, {image: slides[0].image, type: "imageLoaded"});

        expect(state).toEqual(initialState);
      });

      it("updates state", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const initialState = {...defaultState, image: slides[1].image, imageLoading: true, slides};
        const state = reduceActions(initialState, {image: slides[1].image, type: "imageLoaded"});

        expect(slides[1].loaded).toEqual(false);
        expect(state).toEqual({
          error: null,
          image: slides[1].image,
          imageLoading: false,
          imageLoadingAttempts: 0,
          slides: [slides[0], {...slides[1], loaded: true}]
        });
      });
    });

    describe("imageLoading", () => {
      it("updates state", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const initialState = {...defaultState, image: slides[0].image, imageLoading: false, slides};
        const state = reduceActions(initialState, {image: slides[1].image, type: "imageLoading"});

        expect(state).toEqual({
          error: null,
          image: slides[1].image,
          imageLoading: true,
          imageLoadingAttempts: 0,
          slides
        });
      });
    });

    describe("reset", () => {
      it("updates state", () => {
        const getImageURL = jest.fn().mockName("getImageURL")
          .mockImplementation(({size, slide}) => `${slide.image}&size=${size[0]}+${size[1]}`);
        const size = [800, 600];
        const slides = [
          createSlide({loaded: true, response: true, time_taken: 600}),
          createSlide({loaded: true, response: false, time_taken: 400}),
          createSlide()
        ];
        const cachedSlides = [
          slice(slides[0], ["id", "response", "time_taken"]),
          slice(slides[1], ["id", "response", "time_taken"])
        ];
        const state = reduceActions(
          {...defaultState, size},
          {cachedSlides, getImageURL, slides, type: "reset"}
        );

        expect(getImageURL).toHaveBeenCalledWith({size, slide: slides[0]});
        expect(getImageURL).toHaveBeenCalledWith({size, slide: slides[1]});
        expect(getImageURL).toHaveBeenCalledWith({size, slide: slides[2]});
        expect(state).toEqual({
          error: null,
          getImageURL,
          imageLoading: false,
          imageLoadingAttempts: 0,
          size,
          slides: [
            {...slides[0], image: `${slides[0].image}&size=${size[0]}+${size[1]}`, loaded: false},
            {...slides[1], image: `${slides[1].image}&size=${size[0]}+${size[1]}`, loaded: false},
            {
              ...slides[2],
              image: `${slides[2].image}&size=${size[0]}+${size[1]}`,
              loaded: false,
              response: undefined
            }
          ],
          startTime: Date.now()
        });
      });

      it("uses likert responses", () => {
        const getImageURL = jest.fn().mockName("getImageURL")
          .mockImplementation(({size, slide}) => `${slide.image}&size=${size[0]}+${size[1]}`);
        const size = [800, 600];
        const slides = [
          createSlide({loaded: true, likert_response: "REALLY_NOT_ME", time_taken: 600}),
          createSlide({loaded: true, likert_response: "REALLY_ME", time_taken: 400}),
          createSlide()
        ];
        const cachedSlides = [
          {...slice(slides[0], ["id", "time_taken"]), response: slides[0].likert_response},
          {...slice(slides[1], ["id", "time_taken"]), response: slides[1].likert_response}
        ];
        const state = reduceActions(
          {...defaultState, size},
          {cachedSlides, getImageURL, slides, type: "reset"}
        );
        const combinedSlides = slides.map((slide) => remap(slide, {likert_response: "response"}));

        expect(getImageURL).toHaveBeenCalledWith({size, slide: combinedSlides[0]});
        expect(getImageURL).toHaveBeenCalledWith({size, slide: combinedSlides[1]});
        expect(getImageURL).toHaveBeenCalledWith({size, slide: combinedSlides[2]});
        expect(state).toEqual({
          error: null,
          getImageURL,
          imageLoading: false,
          imageLoadingAttempts: 0,
          size,
          slides: [
            {
              ...combinedSlides[0],
              image: `${slides[0].image}&size=${size[0]}+${size[1]}`,
              loaded: false
            },
            {
              ...combinedSlides[1],
              image: `${slides[1].image}&size=${size[0]}+${size[1]}`,
              loaded: false
            },
            {
              ...combinedSlides[2],
              image: `${slides[2].image}&size=${size[0]}+${size[1]}`,
              loaded: false
            }
          ],
          startTime: Date.now()
        });
      });
    });

    describe("resize", () => {
      it("updates state", () => {
        const getImageURL = jest.fn().mockName("getImageURL")
          .mockImplementation(({size, slide}) => `${slide.image}&size=${size[0]}+${size[1]}`);
        const size = [800, 600];
        const slides = [createSlide({loaded: true}), createSlide()];
        const startTime = Date.now();
        const initialState = {
          ...defaultState,
          getImageURL,
          image: slides[1].image,
          imageLoading: true,
          slides,
          startTime
        };

        advanceTimeBy(3000);

        const state = reduceActions(initialState, {size, type: "resize"});

        expect(getImageURL).toHaveBeenCalledWith({size, slide: slides[0]});
        expect(getImageURL).toHaveBeenCalledWith({size, slide: slides[1]});
        expect(state).toEqual({
          error: null,
          getImageURL,
          image: null,
          imageLoading: false,
          imageLoadingAttempts: 0,
          size,
          slides: [
            {...slides[0], image: `${slides[0].image}&size=${size[0]}+${size[1]}`, loaded: false},
            {...slides[1], image: `${slides[1].image}&size=${size[0]}+${size[1]}`, loaded: false}
          ],
          startTime
        });
      });
    });

    describe("retry", () => {
      it("updates state", () => {
        const slides = [createSlide({loaded: true}), createSlide()];
        const state = reduceActions({...defaultState, imageLoading: true, slides}, {type: "retry"});

        expect(state).toEqual({
          error: null,
          imageLoading: true,
          imageLoadingAttempts: 0,
          slides,
          startTime: Date.now()
        });
      });
    });
  });

  describe("reducer", () => {
    let defaultState;

    beforeEach(() => {
      defaultState = {error: null, imageLoading: false, imageLoadingAttempts: 0};
    });

    describe("ready", () => {
      it("is when next 2 slides are loaded", () => {
        const slides = [
          createSlide({response: false}),
          createSlide({loaded: true}),
          createSlide({loaded: true}),
          createSlide({loaded: true}),
          createSlide()
        ];
        const state = reducer({...defaultState, slides}, {type: "none"});

        expect(state).toEqual({...defaultState, slides, ready: true, slideIndex: 1});
      });

      it("is when remaining slides are loaded", () => {
        const slides = [
          createSlide({loaded: true, response: true}),
          createSlide({loaded: true})
        ];
        const state = reducer({...defaultState, slides}, {type: "none"});

        expect(state).toEqual({...defaultState, slides, ready: true, slideIndex: 1});
      });

      it("isn't when next 2 slides aren't loaded", () => {
        const slides = [
          createSlide({loaded: true, response: true}),
          createSlide({loaded: true}),
          createSlide({loaded: true}),
          createSlide()
        ];
        const state = reducer({...defaultState, slides}, {type: "none"});

        expect(state).toEqual({...defaultState, slides, ready: false, slideIndex: 1});
      });

      it("isn't when remaining slides aren't loaded", () => {
        const slides = [
          createSlide({loaded: true, response: true}),
          createSlide()
        ];
        const state = reducer({...defaultState, slides}, {type: "none"});

        expect(state).toEqual({...defaultState, slides, ready: false, slideIndex: 1});
      });
    });

    it("returns default state", () => {
      const state = reducer(defaultState, {type: "none"});

      expect(state).toEqual({...defaultState, ready: false, slideIndex: -1});
    });
  });
});
