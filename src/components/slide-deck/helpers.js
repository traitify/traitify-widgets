export function completedSlides(slides) {
  return slides.filter(({response}) => (
    response != null
  )).map(({id, response, time_taken: timeTaken}) => ({
    id,
    response,
    time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
  }));
}

export function dataMapper(assessment) {
  if(!assessment) { return null; }

  const data = [];

  assessment.id && data.push(assessment.id);
  assessment.locale_key && data.push(assessment.locale_key);
  assessment.slides && assessment.slides.forEach((slide) => {
    data.push(`${slide.id}-${slide.caption}`);
  });

  return JSON.stringify(data);
}

export function dataChanged(newAssessment, oldAssessment) {
  return dataMapper(newAssessment) !== dataMapper(oldAssessment);
}

export function isFinished(slides) {
  return slides.length > 0 && slides.length === completedSlides(slides).length;
}

export function isFullscreen() {
  const fullscreen = document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement;

  return !!fullscreen;
}

export function loadingIndex(slides) {
  return slides.findIndex((slide) => (!slide.loaded && slide.response == null));
}

export function mutable(data) { return data.map((item) => ({...item})); }

export function slideIndex(slides) {
  return slides.findIndex((slide) => (slide.response == null));
}

export function toggleFullscreen(options) {
  const {current, element} = options;

  if(current) {
    const exitFullscreen = document.exitFullscreen
      || document.webkitExitFullscreen
      || document.mozCancelFullScreen
      || document.msExitFullscreen;

    exitFullscreen.apply(document);
  } else {
    const requestFullscreen = element.requestFullscreen
      || element.webkitRequestFullscreen
      || element.mozRequestFullScreen
      || element.msRequestFullscreen;

    requestFullscreen.apply(element);
  }
}

export function isReady(slides) {
  if(slides.length === 0) { return false; }

  const loadedIndex = loadingIndex(slides);
  const remainingSlidesLoaded = loadedIndex === -1;
  const nextSlidesLoaded = loadedIndex > slideIndex(slides) + 2;

  return remainingSlidesLoaded || nextSlidesLoaded;
}

export function getStateFromProps(props) {
  const state = {
    finished: false,
    imageLoading: false,
    imageLoadingAttempts: 0,
    slides: [],
    showInstructions: false
  };
  const {assessment, assessmentID, cache, getOption} = props;
  if(!assessment || !assessment.slides || assessment.slides.length === 0) { return state; }

  const storedSlides = cache.get(`slides.${assessmentID}`) || [];

  state.slides = assessment.slides.map((_slide) => {
    const slide = {..._slide};
    const completedSlide = storedSlides.find((s) => s.id === slide.id);
    if(completedSlide) {
      slide.response = completedSlide.response;
      slide.time_taken = completedSlide.time_taken;
    }

    return slide;
  });
  state.startTime = Date.now();

  if(getOption("allowInstructions") && assessment.instructions) {
    state.instructions = assessment.instructions.instructional_text;
    state.showInstructions = true;
  }

  return state;
}
