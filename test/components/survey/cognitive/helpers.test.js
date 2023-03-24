/** @jest-environment jsdom */
import {createRef, forwardRef} from "react";
import {
  loadImage,
  loadQuestions,
  reducer,
  useQuestionsLoader
} from "components/survey/cognitive/helpers";
import {dig, mutable} from "lib/helpers/object";
import ComponentHandler from "support/component-handler";

const url = "https://via.placeholder.com/150";
const defaultResponse = {image: {url}};
const defaultResponses = Array.from(Array(4)).map(() => mutable(defaultResponse));
const defaultQuestion = mutable({questionImage: {url}, responses: defaultResponses});
const loadedResponse = {image: {loaded: true, url}};
const loadedResponses = Array.from(Array(4)).map(() => mutable(loadedResponse));
const loadedQuestion = mutable({
  loaded: true,
  questionImage: {loaded: true, url},
  responses: loadedResponses
});

describe("Helpers", () => {
  describe("actions", () => {
    let createElementSpy;
    let dispatch;
    let img;
    let mockImageLoaded;

    beforeAll(() => {
      createElementSpy = jest.spyOn(document, "createElement");
      mockImageLoaded = () => {
        const result = createElementSpy.mock.results[0];
        const onLoad = dig(result, "value", "onload");

        onLoad && onLoad();
      };
    });

    beforeEach(() => {
      dispatch = jest.fn().mockName("dispatch");
    });

    afterEach(() => {
      createElementSpy.mockClear();
    });

    afterAll(() => {
      createElementSpy.mockRestore();
    });

    describe("loadImage", () => {
      const imageType = "response";

      beforeEach(() => {
        loadImage({dispatch, imageType, url});
        img = createElementSpy.mock.results[0].value;
      });

      it("dispatches error", () => {
        img.onerror();

        expect(dispatch).toHaveBeenCalledWith({error: "Image could not load", type: "error"});
      });

      it("dispatches imageLoaded", () => {
        img.onload();

        expect(dispatch).toHaveBeenCalledWith({imageType, type: "imageLoaded"});
      });

      it("dispatches imageLoading", () => {
        expect(dispatch).toHaveBeenCalledWith({type: "imageLoading"});
      });

      it("sets image src", () => {
        expect(img.src).toBe(url);
      });
    });

    describe("loadQuestions", () => {
      it("dispatches questionLoaded", () => {
        const questions = [{
          questionImage: {loaded: true, url},
          responses: [
            {image: {loaded: true, url}},
            {image: {loaded: true, url}},
            {image: {loaded: true, url}},
            {image: {loaded: true, url}}
          ]
        }];
        loadQuestions({dispatch, questions});

        expect(dispatch).not.toHaveBeenCalledWith({type: "imageLoading"});
        expect(dispatch).toHaveBeenCalledWith({type: "questionLoaded"});
      });

      it("dispatches imageLoaded for question image", () => {
        const questions = [{
          questionImage: {loaded: false, url},
          responses: [
            {image: {loaded: true, url}},
            {image: {loaded: true, url}},
            {image: {loaded: true, url}},
            {image: {loaded: true, url}}
          ]
        }];
        loadQuestions({dispatch, questions});
        mockImageLoaded();

        expect(dispatch).toHaveBeenCalledWith({type: "imageLoading"});
        expect(dispatch).toHaveBeenCalledWith({imageType: "question", type: "imageLoaded"});
        expect(dispatch).not.toHaveBeenCalledWith({type: "questionLoaded"});
      });

      it("dispatches imageLoaded for response image", () => {
        const questions = [{
          questionImage: {loaded: true, url},
          responses: [
            {image: {loaded: true, url}},
            {image: {loaded: false, url}},
            {image: {loaded: false, url}},
            {image: {loaded: false, url}}
          ]
        }];
        loadQuestions({dispatch, questions});
        mockImageLoaded();

        expect(dispatch).toHaveBeenCalledWith({type: "imageLoading"});
        expect(dispatch).toHaveBeenCalledWith({imageType: "response", type: "imageLoaded"});
        expect(dispatch).not.toHaveBeenCalledWith({type: "questionLoaded"});
      });

      it("does nothing if all questions loaded", () => {
        const questions = [
          {loaded: true, questionImage: {loaded: true, url}},
          {loaded: true, questionImage: {loaded: true, url}}
        ];
        loadQuestions({dispatch, questions});

        expect(dispatch).not.toHaveBeenCalledWith({type: "imageLoading"});
        expect(dispatch).not.toHaveBeenCalledWith({type: "questionLoaded"});
      });

      it("does nothing without a quesitonImage", () => {
        const questions = [{}];
        loadQuestions({dispatch, questions});

        expect(dispatch).not.toHaveBeenCalledWith({type: "imageLoading"});
        expect(dispatch).not.toHaveBeenCalledWith({type: "questionLoaded"});
      });
    });
  });

  describe("reducer", () => {
    describe("default", () => {
      it("updates state", () => {
        const questions = [loadedQuestion, defaultQuestion];
        const state = reducer({error: "oh no", imageLoading: true, loading: true, questions}, {type: "idk"});

        expect(state).toEqual({error: "oh no", imageLoading: true, loading: true, questions});
      });
    });

    describe("error", () => {
      it("updates state", () => {
        const questions = [loadedQuestion, defaultQuestion];
        const state = reducer({questions}, {error: "oh no", type: "error"});

        expect(state).toEqual({error: "oh no", questions});
      });
    });

    describe("imageLoaded", () => {
      describe("response", () => {
        it("loads first response", () => {
          const questions = [loadedQuestion, defaultQuestion];
          const state = reducer({error: "oh no", questions}, {imageType: "response", type: "imageLoaded"});

          expect(state).toEqual({
            error: null,
            imageLoading: false,
            loading: true,
            questions: [
              loadedQuestion,
              {
                ...defaultQuestion,
                responses: [loadedResponse, ...defaultResponses.slice(1)]
              }
            ]
          });
        });

        it("loads last response", () => {
          const questions = [
            loadedQuestion,
            {
              ...defaultQuestion,
              responses: [...loadedResponses.slice(1), defaultResponse]
            }
          ];
          const state = reducer({error: "oh no", questions}, {imageType: "response", type: "imageLoaded"});

          expect(state).toEqual({
            error: null,
            imageLoading: false,
            loading: true,
            questions: [
              loadedQuestion,
              {...defaultQuestion, responses: loadedResponses}
            ]
          });
        });
      });

      describe("question image", () => {
        it("loads first question's image", () => {
          const questions = [
            {...defaultQuestion, responses: loadedResponses},
            defaultQuestion
          ];
          const state = reducer({error: "oh no", questions}, {imageType: "question", type: "imageLoaded"});

          expect(state).toEqual({
            error: null,
            imageLoading: false,
            loading: true,
            questions: [loadedQuestion, defaultQuestion]
          });
        });

        it("loads last question's image", () => {
          const questions = [
            loadedQuestion,
            {...defaultQuestion, responses: loadedResponses}
          ];
          const state = reducer({error: "oh no", questions}, {imageType: "question", type: "imageLoaded"});

          expect(state).toEqual({
            error: null,
            imageLoading: false,
            loading: false,
            questions: [loadedQuestion, loadedQuestion]
          });
        });
      });
    });

    describe("imageLoading", () => {
      it("updates state", () => {
        const questions = [loadedQuestion, defaultQuestion];
        const state = reducer({error: "oh no", questions}, {type: "imageLoading"});

        expect(state).toEqual({error: "oh no", imageLoading: true, loading: true, questions});
      });
    });

    describe("questionLoaded", () => {
      it("loads first question", () => {
        const questions = [
          {...loadedQuestion, loaded: false},
          defaultQuestion
        ];
        const state = reducer({error: "oh no", questions}, {type: "questionLoaded"});

        expect(state).toEqual({
          error: null,
          imageLoading: false,
          loading: true,
          questions: [loadedQuestion, defaultQuestion]
        });
      });

      it("loads last question", () => {
        const questions = [
          loadedQuestion,
          {...loadedQuestion, loaded: false}
        ];
        const state = reducer({error: "oh no", questions}, {type: "questionLoaded"});

        expect(state).toEqual({
          error: null,
          imageLoading: false,
          loading: false,
          questions: [loadedQuestion, loadedQuestion]
        });
      });
    });

    describe("reset", () => {
      it("updates state", () => {
        const questions = [loadedQuestion, defaultQuestion];
        const state = reducer({error: "oh no", questions: [loadedQuestion]}, {questions, type: "reset"});

        expect(state).toEqual({imageLoading: false, questions});
      });
    });

    describe("response", () => {
      it("updates state", () => {
        const answer = {skipped: true};
        const questions = [loadedQuestion, loadedQuestion];
        const state = reducer({imageLoading: true, questions}, {answer, questionIndex: 1, type: "response"});

        expect(state).toEqual({
          error: null,
          imageLoading: true,
          questions: [
            loadedQuestion,
            {...loadedQuestion, answer: {skipped: true}}
          ]
        });
      });
    });
  });

  describe("useQuestionsLoader", () => {
    let createElementSpy;
    let mockImageLoaded;

    const Component = forwardRef(({initialQuestions}, ref) => {
      ref.current = useQuestionsLoader(initialQuestions); // eslint-disable-line no-param-reassign

      return null;
    });

    beforeAll(() => {
      createElementSpy = jest.spyOn(document, "createElement");
      mockImageLoaded = () => {
        const result = createElementSpy.mock.results[0];
        const onLoad = dig(result, "value", "onload");

        onLoad && onLoad();
      };
    });

    afterEach(() => {
      createElementSpy.mockClear();
    });

    afterAll(() => {
      createElementSpy.mockRestore();
    });

    it("returns current state", () => {
      const initialQuestions = [defaultQuestion, defaultQuestion];
      const ref = createRef();
      new ComponentHandler(<Component initialQuestions={initialQuestions} ref={ref} />);

      expect(ref.current).toEqual({
        error: undefined,
        dispatch: expect.any(Function),
        loading: true,
        questions: [defaultQuestion, defaultQuestion]
      });
    });

    it("updates state from dispatch", () => {
      const initialQuestions = [defaultQuestion, defaultQuestion];
      const ref = createRef();
      const component = new ComponentHandler(
        <Component initialQuestions={initialQuestions} ref={ref} />
      );
      component.act(() => (
        ref.current.dispatch({answer: {skipped: true}, questionIndex: 0, type: "response"})
      ));

      expect(ref.current).toEqual({
        error: null,
        dispatch: expect.any(Function),
        loading: true,
        questions: [
          {...defaultQuestion, answer: {skipped: true}},
          defaultQuestion
        ]
      });
    });

    it("updates state from image loading", () => {
      const initialQuestions = [defaultQuestion, defaultQuestion];
      const ref = createRef();
      const component = new ComponentHandler(
        <Component initialQuestions={initialQuestions} ref={ref} />
      );
      component.act(() => mockImageLoaded());

      expect(ref.current).toEqual({
        error: null,
        dispatch: expect.any(Function),
        loading: true,
        questions: [
          {
            ...defaultQuestion,
            loaded: false,
            questionImage: {...defaultQuestion.questionImage, loaded: true}
          },
          defaultQuestion
        ]
      });
    });

    it("updates state from props", () => {
      const initialQuestions = [defaultQuestion, defaultQuestion];
      const ref = createRef();
      const component = new ComponentHandler(
        <Component initialQuestions={initialQuestions} ref={ref} />
      );
      component.updateProps({initialQuestions: [loadedQuestion, defaultQuestion]});

      expect(ref.current).toEqual({
        error: undefined,
        dispatch: expect.any(Function),
        loading: true,
        questions: [loadedQuestion, defaultQuestion]
      });
    });
  });
});
