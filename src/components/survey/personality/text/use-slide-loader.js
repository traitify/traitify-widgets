import {useReducer} from "react";
import except from "lib/common/object/except";
import mutable from "lib/common/object/mutable";
import useSafeDispatch from "lib/hooks/use-safe-dispatch";

const currentSlide = ({response}) => response == null;

export function reduceActions(state, action) {
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
    case "reset": {
      const {cachedSlides, slides: _slides} = action;
      const slides = mutable(_slides).map(({likert_response: likertResponse, ...slide}) => {
        const cachedSlide = cachedSlides.find(({id}) => id === slide.id);

        return cachedSlide
          ? {...slide, response: cachedSlide.response, time_taken: cachedSlide.time_taken}
          : {...slide, response: likertResponse || slide.response};
      });

      return {...state, slides, startTime: Date.now()};
    }
    default:
      return state;
  }
}

export function reducer(_state, action) {
  const state = reduceActions(_state, action);
  const slides = state.slides || [];
  const slideIndex = slides.findIndex(currentSlide);
  const ready = slides.length > 0;

  return {...state, ready, slideIndex};
}

export default function useSlideLoader() {
  const [
    {ready, slideIndex, slides},
    unsafeDispatch
  ] = useReducer(reducer, {ready: false, slideIndex: -1, slides: []});
  const dispatch = useSafeDispatch(unsafeDispatch);

  return {dispatch, ready, slideIndex, slides};
}
