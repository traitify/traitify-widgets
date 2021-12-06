import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import useFullscreen from "lib/hooks/use-fullscreen";
import useSlideLoader from "lib/hooks/use-slide-loader";
import {dig, slice, toQueryString} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {camelCase} from "lib/helpers/string";
import withTraitify from "lib/with-traitify";
import NotReady from "./not-ready";
import Slide from "./slide";
import style from "./style.scss";

const maxRetries = 2;

function Personality({element, setElement, ...props}) {
  const {
    assessment,
    cache,
    getAssessment,
    getCacheKey,
    getOption,
    isReady,
    traitify,
    translate,
    ui
  } = props;
  const {error, dispatch, ready, slideIndex, slides} = useSlideLoader({element, translate});
  const [fullscreen, toggleFullscreen] = useFullscreen(element);
  const [instructions, setInstructions] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const submitting = useRef(false);

  const completedSlides = slides.filter(({response}) => response != null)
    .map((slide) => slice(slide, ["id", "response", "time_taken"]));
  const finished = slides.length > 0 && slides.length === completedSlides.length;
  const likertScale = dig(assessment, "scoring_scale") === "LIKERT_CUMULATIVE_POMP";
  const resultsReady = isReady("results");
  const state = {
    finished,
    fullscreen,
    showInstructions,
    slides
  };

  useDidMount(() => { ui.trigger("SlideDeck.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("SlideDeck.updated", {props, state}); });
  useDidUpdate(() => { ui.trigger("SlideDeck.fullscreen", {props, state}, fullscreen); }, [fullscreen]);
  useEffect(() => {
    if(!dig(assessment, "slides")) { return; }

    const cachedData = cache.get(getCacheKey("slide-deck")) || {};
    const getImageURL = ({size, slide}) => {
      const imageHost = getOption("imageHost");
      const [width, height] = size;
      if(width <= 0 || height <= 0) { return slide.image_desktop; }

      const baseURL = `${imageHost}/slides/${slide.image_desktop_retina.split("/").pop()}`;
      const params = {
        "auto": "format",
        "fp-x": slide.focus_x / 100,
        "fp-y": slide.focus_y / 100,
        "h": (likertScale && window.innerWidth <= 768) ? height - 74 : height,
        "w": width
      };

      return `${baseURL}?${toQueryString(params)}`;
    };

    dispatch({
      cachedSlides: cachedData.slides || [],
      getImageURL,
      slides: assessment.slides,
      type: "reset"
    });
  }, [
    dig(assessment, "id"),
    dig(assessment, "locale_key"),
    dig(assessment, "slides")
  ]);

  useEffect(() => {
    const show = getOption("allowInstructions");
    const text = dig(assessment, "instructions", "instructional_text");

    setInstructions(text);
    setShowInstructions(show && !!text);
  }, [dig(assessment, "instructions")]);

  useEffect(() => {
    if(completedSlides.length === 0) { return; }

    cache.set(getCacheKey("slide-deck"), {slides: completedSlides});
  }, [completedSlides]);

  useEffect(() => {
    if(!finished) { return; }
    if(resultsReady) { return; }
    if(submitAttempts > maxRetries) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    traitify.put(
      `/assessments/${assessment.id}/slides`,
      completedSlides.map(({id, response, time_taken: timeTaken}) => ({
        id,
        [likertScale ? "likert_response" : "response"]: response,
        time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
      }))
    ).then((response) => {
      submitting.current = false;

      ui.trigger("SlideDeck.finished", {state, props}, response);
      getAssessment({force: true});
    }).catch((response) => {
      submitting.current = false;

      let newError;

      try {
        newError = JSON.parse(response).errors[0];
      } catch(e) {
        newError = response;
      }

      setSubmitAttempts(submitAttempts + 1);
      if(submitAttempts >= maxRetries) { setSubmitError(newError); }
    });
  }, [finished, submitAttempts]);

  if(resultsReady) { return null; }

  const retry = () => {
    if(!submitError) { return dispatch({action: "retry"}); }

    setSubmitAttempts(0);
    setSubmitError(null);
  };
  const updateSlide = (index, value) => {
    dispatch({index, response: value, type: "answer"});

    const key = likertScale ? `likert.${camelCase(value)}` : camelCase(value ? "me" : "not-me");
    ui.trigger(`SlideDeck.${key}`, {props, state});
    ui.trigger("SlideDeck.updateSlide", {props, state});
  };

  return (
    <div className={style.container} ref={setElement}>
      {(finished || !ready) ? (
        <NotReady error={submitError || error} retry={retry} translate={translate} />
      ) : (
        <Slide
          {...{
            back: () => dispatch({type: "back"}),
            fullscreen,
            getOption,
            instructions,
            likertScale,
            showInstructions,
            slideIndex,
            slides,
            start: () => setShowInstructions(false),
            toggleFullscreen,
            translate,
            updateSlide
          }}
        />
      )}
    </div>
  );
}

Personality.defaultProps = {assessment: null, element: null};
Personality.propTypes = {
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    instructions: PropTypes.shape({instructional_text: PropTypes.string.isRequired}),
    locale_key: PropTypes.string.isRequired,
    scoring_scale: PropTypes.string,
    slides: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  cache: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired
  }).isRequired,
  element: PropTypes.instanceOf(Element),
  getAssessment: PropTypes.func.isRequired,
  getCacheKey: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  traitify: TraitifyPropTypes.traitify.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Personality as Component};
export default withTraitify(Personality);
