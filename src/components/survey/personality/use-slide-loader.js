import {useEffect, useReducer} from "react";
import except from "lib/common/object/except";
import mutable from "lib/common/object/mutable";
import useSafeDispatch from "lib/hooks/use-safe-dispatch";

const defaultState = {
  error: null,
  imageLoading: false,
  imageLoadingAttempts: 0
};

const currentSlide = ({response}) => response == null;
const loadingSlide = ({loaded, response}) => !loaded && response == null;
const maxRetries = 3;

function loadSlides({dispatch, slides}) {
  const slide = slides.find(loadingSlide);
  if(!slide) { return; }

  dispatch({image: slide.image, type: "imageLoading"});

  const img = document.createElement("img");
  img.onload = () => dispatch({image: slide.image, type: "imageLoaded"});
  img.onerror = () => setTimeout(() => dispatch({image: slide.image, type: "imageError"}), 2000);
  img.src = slide.image;
}

export function reduceImageActions(state, action) {
  switch(action.type) {
    case "imageError": {
      if(state.image !== action.image) { return state; }

      return {...state, imageLoading: false, imageLoadingAttempts: state.imageLoadingAttempts + 1};
    }
    case "imageLoaded": {
      if(state.image !== action.image) { return state; }

      const slides = mutable(state.slides)
        .map((slide) => (slide.image === action.image ? {...slide, loaded: true} : slide));

      return {...state, ...defaultState, slides};
    }
    case "imageLoading":
      return {...state, image: action.image, imageLoading: true};
    case "reset": {
      const {cachedSlides, getImageURL, slides: _slides} = action;
      const size = state.size || [0, 0];
      const slides = mutable(_slides).map(({likert_response: likertResponse, ...slide}) => {
        const cachedSlide = cachedSlides.find(({id}) => id === slide.id);

        return cachedSlide
          ? {...slide, response: cachedSlide.response, time_taken: cachedSlide.time_taken}
          : {...slide, response: likertResponse || slide.response};
      }).map((slide) => ({...slide, image: getImageURL({size, slide}), loaded: false}));

      return {...state, ...defaultState, getImageURL, slides, startTime: Date.now()};
    }
    case "resize": {
      const {size} = action;
      const slides = state.slides
        .map((slide) => ({...slide, image: state.getImageURL({size, slide}), loaded: false}));

      return {...state, ...defaultState, image: null, size, slides};
    }
    case "retry":
      return {...state, error: null, imageLoadingAttempts: 0, startTime: Date.now()};
    default:
      return state;
  }
}

export function reduceTextActions(state, action) {
  switch(action.type) {
    case "reset": {
      const {cachedSlides, slides: _slides} = action;
      const slides = mutable(_slides).map(({likert_response: likertResponse, ...slide}) => {
        const cachedSlide = cachedSlides.find(({id}) => id === slide.id);

        return cachedSlide
          ? {...slide, response: cachedSlide.response, time_taken: cachedSlide.time_taken}
          : {...slide, response: likertResponse || slide.response};
      }).map((slide) => ({...slide, loaded: true}));

      return {...state, ...defaultState, slides, startTime: Date.now()};
    }
    case "retry":
      return {...state, error: null, startTime: Date.now()};
    default:
      return state;
  }
}

export function reduceActions(_state, action) {
  let state = {..._state};

  if(Object.hasOwn(action, "textSurvey")) { state.textSurvey = action.textSurvey; }

  state = state.textSurvey
    ? reduceTextActions(state, action)
    : reduceImageActions(state, action);

  switch(action.type) {
    case "answer": {
      const {index, response} = action;
      const slides = mutable(state.slides);
      slides[index].response = response;
      slides[index].time_taken = Date.now() - state.startTime;

      return {...state, slides, startTime: Date.now()};
    }
    case "back": {
      const slides = mutable(state.slides);
      let index = slides.findIndex(currentSlide) - 1;

      if(index < -1) { index = slides.length - 1; }
      if(index >= 0) { slides[index] = except(slides[index], ["response", "time_taken"]); }

      return {...state, slides, startTime: Date.now()};
    }
    case "error":
      return {...state, error: action.error};
    default:
      return state;
  }
}

export function reducer(_state, action) {
  const state = reduceActions(_state, action);
  const slides = state.slides || [];
  const slideIndex = slides.findIndex(currentSlide);
  let ready = slides.length > 0;

  if(state.textSurvey) { return {...state, ready, slideIndex}; }
  if(ready) {
    const loadingIndex = slides.findIndex(loadingSlide);
    const nextSlidesLoaded = loadingIndex > slideIndex + 2;
    const remainingSlidesLoaded = loadingIndex === -1;

    ready = remainingSlidesLoaded || nextSlidesLoaded;
  }

  return {...state, ready, slideIndex};
}

export default function useSlideLoader({textSurvey: _textSurvey, translate}) {
  const [
    {
      error,
      imageLoading,
      imageLoadingAttempts,
      ready,
      slideIndex,
      slides,
      textSurvey
    },
    unsafeDispatch
  ] = useReducer(reducer, {
    ...defaultState,
    ready: false,
    slideIndex: -1,
    slides: [],
    textSurvey: _textSurvey
  });
  const dispatch = useSafeDispatch(unsafeDispatch);

  useEffect(() => {
    if(textSurvey) { return; }
    if(imageLoading) { return; }
    if(imageLoadingAttempts > maxRetries) { return; }

    loadSlides({dispatch, slides});
  }, [imageLoading, imageLoadingAttempts, slides]);

  useEffect(() => {
    if(imageLoadingAttempts <= maxRetries) { return; }

    dispatch({error: translate("slide_error"), type: "error"});
  }, [imageLoadingAttempts]);

  return {error, dispatch, ready, slideIndex, slides};
}
