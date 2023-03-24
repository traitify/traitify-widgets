import {
  faChevronLeft,
  faMaximize,
  faMinimize
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import Icon from "components/common/icon";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import dig from "lib/common/object/dig";
import slice from "lib/common/object/slice";
import toQueryString from "lib/common/object/to-query-string";
import camelCase from "lib/common/string/camel-case";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useFullscreen from "lib/hooks/use-fullscreen";
import useHttp from "lib/hooks/use-http";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import {assessmentQuery} from "lib/recoil";
import Image from "./image";
import useSlideLoader from "./use-slide-loader";
import style from "./style.scss";

const maxRetries = 2;

// TODO:
//   moving more thihngs into useMemo
//   updating rest of component
export default function PersonalitySurvey() {
  const assessment = useAssessment();
  const cache = useCache();
  const cacheKey = useCacheKey("survey");
  const caption = useRef(null);
  const element = useRef(null);
  const http = useHttp();
  const image = useRef(null);
  const listener = useListener();
  const refreshAssessment = useRecoilRefresher(assessmentQuery);
  const results = useResults();
  const translate = useTranslate();
  const {
    error,
    dispatch,
    ready,
    slideIndex,
    slides
  } = useSlideLoader({element: image.current, translate});
  const {allowBack, allowFullscreen, ...options} = useOption("slideDeck") || {};
  const [fullscreen, toggleFullscreen] = useFullscreen(element.current);
  const [instructions, setInstructions] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const submitting = useRef(false);
  const state = {fullscreen};

  const completedSlides = slides.filter(({response}) => response != null)
    .map((slide) => slice(slide, ["id", "response", "time_taken"]));
  const finished = slides.length > 0 && slides.length === completedSlides.length;
  const likertScale = dig(assessment, "scoring_scale") === "LIKERT_CUMULATIVE_POMP";

  useComponentEvents("Survey", {...state});
  useEffect(() => {
    if(!assessment) { return; }
    if(assessment.slides.length === 0) { return; }

    const cachedData = cache.get(cacheKey) || {};
    const getImageURL = ({size, slide}) => {
      const [width, height] = size;
      const slideImage = slide.images
        .reduce((max, current) => (max.height > current.height ? max : current));
      if(width <= 0 || height <= 0) { return slideImage.url; }

      const params = {
        h: (likertScale && window.innerWidth <= 768) ? height - 74 : height,
        w: width
      };

      return `${slideImage.url}&${toQueryString(params)}`;
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

  // TODO: useMemo
  useEffect(() => {
    const show = options.showInstructions;
    const text = dig(assessment, "instructions", "instructional_text");

    setInstructions(text);
    setShowInstructions(show && !!text);
  }, [assessment, options]);

  useEffect(() => {
    if(completedSlides.length === 0) { return; }

    cache.set(cacheKey, {slides: completedSlides});
  }, [completedSlides]);

  useEffect(() => {
    if(!finished) { return; }
    if(results) { return; }
    if(submitAttempts > maxRetries) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    http.put(
      `/assessments/${assessment.id}/slides`,
      completedSlides.map(({id, response, time_taken: timeTaken}) => ({
        id,
        [likertScale ? "likert_response" : "response"]: response,
        time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
      }))
    ).then((response) => {
      submitting.current = false;

      listener.trigger("SlideDeck.finished", {...state, response});
      // TODO: Clear cache?
      refreshAssessment();
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

  if(results) { return null; }

  const back = () => dispatch({type: "back"});
  const content = {};
  const currentSlide = slides[slideIndex];
  const updateSlide = (index, value) => {
    dispatch({index, response: value, type: "answer"});

    listener.trigger("SlideDeck.updateSlide", {...state, response: value});
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
        <div className={[style.instructions, style.slide, style.middle].join(" ")}>
          <Markdown className={style.markdown}>{instructions}</Markdown>
          <button onClick={() => setShowInstructions(false)} type="button">
            {translate("get_started")}
          </button>
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
    const progress = (slideIndex / slides.length) * 100;

    content.caption = currentSlide.caption;
    content.enabled = true;
    content.image = (
      <>
        <div className={style.progress} style={{width: `${progress}%`}} />
        {dig(lastSlide, "loaded") && <Image key={lastSlide.id} orientation="left" slide={lastSlide} />}
        <Image key={currentSlide.id} orientation="middle" slide={currentSlide} />
        {nextSlide && <Image key={nextSlide.id} orientation="right" slide={nextSlide} />}
        {allowBack && slideIndex > 0 && (
          <button className={style.back} onClick={back} type="button">
            <Icon alt={translate("back")} icon={faChevronLeft} />
          </button>
        )}
        {allowFullscreen && (
          <button className={style.fullscreen} onClick={toggleFullscreen} type="button">
            <Icon icon={fullscreen ? faMinimize : faMaximize} />
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
    <div className={[style.container, likertScale && style.likertScale].filter(Boolean).join(" ")} ref={element}>
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
