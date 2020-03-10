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

function loadSlides(slides, dispatch) {
  const slide = slides.find(({loaded}) => !loaded);
  if(!slide) { return; }
  if(!slide.questionImage.loaded) {
    loadImage({dispatch, imageType: "question", url: slide.questionImage.url});
    return;
  }

  const response = slide.responses.find(({image: {loaded}}) => !loaded);
  if(response) {
    loadImage({dispatch, imageType: "response", url: response.image.url});
  }
}

function reducer(state, action) {
  switch(action.type) {
    case "error":
      return {...state, error: action.error};
    case "imageLoaded": {
      const slides = mutable(state.slides);
      const slideIndex = slides.findIndex(({loaded}) => !loaded);
      const slide = slides[slideIndex];

      if(action.imageType === "question") {
        slide.questionImage.loaded = true;
      } else {
        const responseIndex = slide.responses.findIndex(({image: {loaded}}) => !loaded);

        slide.responses[responseIndex].image.loaded = true;
      }

      const questionImageLoaded = slide.questionImage.loaded;
      const responseIndex = slide.responses.findIndex(({image: {loaded}}) => !loaded);
      const responseImagesLoaded = responseIndex === -1;

      slide.loaded = questionImageLoaded && responseImagesLoaded;
      slides[slideIndex] = slide;

      const loading = slides.findIndex(({loaded}) => !loaded) !== -1;

      return {...state, error: null, imageLoading: false, loading, slides};
    }
    case "imageLoading":
      return {...state, imageLoading: true, loading: true};
    case "reset":
      return {slides: action.slides};
    case "response": {
      const slides = mutable(state.slides);
      slides[action.slideIndex].answer = action.answer;

      return {...state, error: null, slides};
    }
    default:
      return {...state};
  }
}

export function useSlidesLoader(initialSlides) {
  const [
    {error, imageLoading, loading, slides},
    dispatch
  ] = useReducer(reducer, {slides: initialSlides});

  useEffect(() => dispatch({slides: initialSlides, type: "reset"}), [initialSlides]);
  useEffect(() => {
    if(!imageLoading) { loadSlides(slides, dispatch); }
  }, [imageLoading, slides]);

  return {error, dispatch, loading, slides};
}
