import {useEffect, useReducer} from "react";
import mutable from "lib/common/object/mutable";
import useSafeDispatch from "lib/hooks/use-safe-dispatch";

export function loadImage({dispatch, imageType, url}) {
  dispatch({type: "imageLoading"});

  const img = document.createElement("img");
  img.onload = () => dispatch({imageType, type: "imageLoaded"});
  img.onerror = () => {
    dispatch({error: "Image could not load", type: "error"});
  };
  img.src = url;
}

export function loadQuestions({dispatch, questions}) {
  const question = questions.find(({loaded}) => !loaded);
  if(!question || !question.questionImage) { return; }
  if(!question.questionImage.loaded) {
    return loadImage({
      dispatch,
      imageType: "question",
      url: question.questionImage.url
    });
  }

  const response = question.responses.find(({image: {loaded}}) => !loaded);
  if(response) {
    return loadImage({
      dispatch,
      imageType: "response",
      url: response.image.url
    });
  }

  dispatch({type: "questionLoaded"});
}

export function reducer(state, action) {
  switch(action.type) {
    case "error":
      return {...state, error: action.error};
    case "imageLoaded":
    case "questionLoaded": {
      const questions = mutable(state.questions);
      const questionIndex = questions.findIndex(({loaded}) => !loaded);
      const question = questions[questionIndex];

      if(action.imageType === "question") {
        question.questionImage.loaded = true;
      } else if(action.imageType === "response") {
        const responseIndex = question.responses.findIndex(({image: {loaded}}) => !loaded);

        question.responses[responseIndex].image.loaded = true;
      }

      const responseIndex = question.responses.findIndex(({image: {loaded}}) => !loaded);
      const responseImagesLoaded = responseIndex === -1;

      question.loaded = question.questionImage.loaded && responseImagesLoaded;
      questions[questionIndex] = question;

      const loading = questions.findIndex(({loaded}) => !loaded) !== -1;

      return {...state, error: null, imageLoading: false, loading, questions};
    }
    case "imageLoading":
      return {...state, imageLoading: true, loading: true};
    case "reset":
      return {imageLoading: false, questions: action.questions};
    case "response": {
      const questions = mutable(state.questions);
      questions[action.questionIndex].answer = action.answer;

      return {...state, error: null, questions};
    }
    default:
      return {...state};
  }
}

export function useQuestionsLoader(initialQuestions) {
  const [
    {error, imageLoading, loading, questions},
    unsafeDispatch
  ] = useReducer(reducer, {questions: initialQuestions});
  const dispatch = useSafeDispatch(unsafeDispatch);

  useEffect(() => dispatch({questions: initialQuestions, type: "reset"}), [initialQuestions]);
  useEffect(() => {
    if(!imageLoading) { loadQuestions({dispatch, questions}); }
  }, [imageLoading, questions]);

  return {error, dispatch, loading, questions};
}

export const videoProps = {
  autoPlay: true,
  disableRemotePlayback: true,
  loop: true,
  muted: true,
  playsInline: true
};
