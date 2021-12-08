import {
  faChevronLeft,
  faCompressArrowsAlt,
  faExpandArrowsAlt
} from "@fortawesome/free-solid-svg-icons";
import Markdown from "markdown-to-jsx";
import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import Loading from "components/loading";
import Icon from "lib/helpers/icon";
import {dig, slice, toQueryString} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {camelCase} from "lib/helpers/string";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import useFullscreen from "lib/hooks/use-fullscreen";
import useSlideLoader from "lib/hooks/use-slide-loader";
import withTraitify from "lib/with-traitify";
import Image from "./image";
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
  const caption = useRef(null);
  const image = useRef(null);
  const {
    error,
    dispatch,
    ready,
    slideIndex,
    slides
  } = useSlideLoader({element: image.current, translate});
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

      setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      if(submitAttempts >= maxRetries) { setSubmitError(newError || "Error Submitting"); }
    });
  }, [finished, submitAttempts]);

  useLayoutEffect(() => {
    if(!caption.current) { return; }

    caption.current.focus();
  }, [showInstructions, slideIndex]);

  if(resultsReady) { return null; }

  const back = () => dispatch({type: "back"});
  const content = {};
  const currentSlide = slides[slideIndex];
  const updateSlide = (index, value) => {
    dispatch({index, response: value, type: "answer"});

    const key = likertScale ? `likert.${camelCase(value)}` : camelCase(value ? "me" : "not-me");
    ui.trigger(`SlideDeck.${key}`, {props, state});
    ui.trigger("SlideDeck.updateSlide", {props, state});
  };

  if(submitError || error) {
    const retry = () => {
      if(!submitError) { return dispatch({type: "retry"}); }

      setSubmitAttempts(0);
      setSubmitError(null);
    };

    content.caption = submitError || error;
    content.image = (
      <div className={style.error}>
        <button className={style.link} onClick={retry} type="button">
          {translate("try_again")}
        </button>
      </div>
    );
  } else if(showInstructions) {
    content.caption = translate("instructions");
    content.image = (
      <>
        <div className={`${style.slide} ${style.middle}`}>
          <div className={style.instructionsSlide}>
            <div className={style.instructionsText}>
              <Markdown>{instructions}</Markdown>
            </div>
            <button className={style.instructionsButton} onClick={() => setShowInstructions(false)} type="button">
              {translate("get_started")}
            </button>
          </div>
        </div>
        {currentSlide && <Image key={currentSlide.id} orientation="right" slide={currentSlide} />}
      </>
    );
  } else if(!ready || finished) {
    content.caption = translate("loading");
    content.image = <div className={style.loading}><Loading /></div>;
  } else {
    const lastSlide = slides[slideIndex - 1];
    const nextSlide = slides[slideIndex + 1];
    const progress = slides.length > 0 ? (slideIndex / slides.length) * 100 : 0;

    content.caption = currentSlide.caption;
    content.enabled = true;
    content.image = (
      <>
        <div className={style.progress} style={{width: `${progress}%`}} />
        {lastSlide && <Image key={lastSlide.id} orientation="left" slide={lastSlide} />}
        <Image key={currentSlide.id} orientation="middle" slide={currentSlide} />
        {nextSlide && <Image key={nextSlide.id} orientation="right" slide={nextSlide} />}
        {getOption("allowBack") && slideIndex > 0 && (
          <button className={style.back} onClick={back} type="button">
            <Icon alt={translate("back")} icon={faChevronLeft} />
          </button>
        )}
        {getOption("allowFullscreen") && (
          <button className={style.fullscreen} onClick={toggleFullscreen} type="button">
            <Icon icon={fullscreen ? faCompressArrowsAlt : faExpandArrowsAlt} />
          </button>
        )}
      </>
    );
  }

  const buttonClass = [
    "traitify--response-button",
    style.response,
    !content.enabled && style.btnDisabled
  ].filter(Boolean).join(" ");
  const buttons = likertScale ? [
    {key: "really_not_me", response: "REALLY_NOT_ME"},
    {key: "not_me", response: "NOT_ME"},
    {key: "me", response: "ME"},
    {key: "really_me", response: "REALLY_ME"}
  ] : [
    {key: "me", response: true},
    {key: "not_me", response: false}
  ];

  return (
    <div className={[style.container, likertScale && style.likertScale].filter(Boolean).join(" ")} ref={setElement}>
      <div className={style.caption} ref={caption} tabIndex="-1">{content.caption}</div>
      <div className={style.image} ref={image}>{content.image}</div>
      <div className={style.buttons}>
        {buttons.map(({key, response}) => (
          <button
            key={key}
            className={[buttonClass, style[camelCase(key)]].join(" ")}
            onClick={content.enabled && (() => updateSlide(slideIndex, response))}
            type="button"
          >
            {translate(key)}
          </button>
        ))}
      </div>
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
