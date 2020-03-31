import {useEffect, useReducer} from "react";
import {mutable} from "../helpers";

export * from "../helpers";

function loadImage({dispatch, imageType, url}) {
  dispatch({type: "imageLoading"});

  const img = document.createElement("img");
  img.onload = () => dispatch({imageType, type: "imageLoaded"});
  img.onerror = () => {
    // TODO: Delay?
    // TODO: Retries?
    dispatch({error: "Image could not load", type: "error"});
  };
  img.src = url;
}

function loadQuestions(questions, dispatch) {
  const question = questions.find(({loaded}) => !loaded);
  if(!question || !question.image) { return; }
  if(!question.image.loaded) {
    loadImage({dispatch, imageType: "question", url: question.image.url});
    return;
  }

  const response = question.responses.find(({image: {loaded}}) => !loaded);
  if(response) {
    loadImage({dispatch, imageType: "response", url: response.image.url});
  }
}

function reducer(state, action) {
  switch(action.type) {
    case "error":
      return {...state, error: action.error};
    case "imageLoaded": {
      const questions = mutable(state.questions);
      const questionIndex = questions.findIndex(({loaded}) => !loaded);
      const question = questions[questionIndex];

      if(action.imageType === "question") {
        question.image.loaded = true;
      } else {
        const responseIndex = question.responses.findIndex(({image: {loaded}}) => !loaded);

        question.responses[responseIndex].image.loaded = true;
      }

      const responseIndex = question.responses.findIndex(({image: {loaded}}) => !loaded);
      const responseImagesLoaded = responseIndex === -1;

      question.loaded = question.image.loaded && responseImagesLoaded;
      questions[questionIndex] = question;

      const loading = questions.findIndex(({loaded}) => !loaded) !== -1;

      return {...state, error: null, imageLoading: false, loading, questions};
    }
    case "imageLoading":
      return {...state, imageLoading: true, loading: true};
    case "reset":
      return {questions: action.questions};
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
    dispatch
  ] = useReducer(reducer, {questions: initialQuestions});

  useEffect(() => dispatch({questions: initialQuestions, type: "reset"}), [initialQuestions]);
  useEffect(() => {
    if(!imageLoading) { loadQuestions(questions, dispatch); }
  }, [imageLoading, questions]);

  return {error, dispatch, loading, questions};
}
