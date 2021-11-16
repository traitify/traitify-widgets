export function completedSlides(slides) {
  return slides.filter(({likert_response: likertResponse, response}) => (
    likertResponse || response != null
  )).map(({id, likert_response: likertResponse, response, time_taken: timeTaken}) => ({
    id,
    likert_response: likertResponse,
    response,
    time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
  }));
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
  return slides.findIndex((slide) => (
    !slide.loaded && !slide.likert_response && slide.response == null
  ));
}

export function slideIndex(slides) {
  return slides.findIndex((slide) => (!slide.likert_response && slide.response == null));
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
