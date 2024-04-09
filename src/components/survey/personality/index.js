import {useEffect, useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import DangerousHTML from "components/common/dangerous-html";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import dig from "lib/common/object/dig";
import slice from "lib/common/object/slice";
import toQueryString from "lib/common/object/to-query-string";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useHttp from "lib/hooks/use-http";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {personalityAssessmentQuery} from "lib/recoil";
import Container from "./container";
import Slide from "./slide";
import style from "./style.scss";
import useSlideLoader from "./use-slide-loader";

const maxRetries = 2;

export default function PersonalitySurvey() {
  const assessment = useAssessment({type: "personality"});
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const cacheKey = useCacheKey({scope: ["slides"], type: "assessment"});
  const http = useHttp();
  const listener = useListener();
  const refreshAssessment = useRecoilRefresher(personalityAssessmentQuery);
  const textSurvey = dig(assessment, "slide_type")?.toLowerCase() === "text";
  const translate = useTranslate();
  const {
    error: loaderError,
    dispatch,
    ready,
    slideIndex,
    slides
  } = useSlideLoader({textSurvey, translate});
  const options = useOption("survey") || {};
  const [showInstructions, setShowInstructions] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const submitting = useRef(false);

  const completedSlides = slides.filter(({response}) => response != null)
    .map((slide) => slice(slide, ["id", "response", "time_taken"]));
  const error = submitError || loaderError;
  const finished = slides.length > 0 && slides.length === completedSlides.length;
  const instructionsHTML = dig(assessment, "instructions", "instructional_html");
  const instructionsText = dig(assessment, "instructions", "instructional_text");
  const likert = dig(assessment, "scoring_scale") === "LIKERT_CUMULATIVE_POMP";
  const progress = slideIndex >= 0 ? (slideIndex / slides.length) * 100 : 0;
  const state = {
    assessment,
    dispatch,
    error,
    finished,
    likert,
    progress,
    ready,
    showInstructions,
    slideIndex,
    slides
  };

  useComponentEvents("Survey", {...state});
  useEffect(() => {
    if(!assessment) { return; }
    if(assessment.completed_at) { return; }
    if(assessment.slides.length === 0) { return; }

    const cachedData = cache.get(cacheKey) || {};
    const getImageURL = ({size, slide}) => {
      const [width, height] = size;
      const slideImage = slide.images
        .reduce((max, current) => (max.height > current.height ? max : current));
      if(width <= 0 || height <= 0) { return slideImage.url; }

      const params = {
        h: (likert && window.innerWidth <= 768) ? height - 74 : height,
        w: width
      };

      return `${slideImage.url}&${toQueryString(params)}`;
    };

    dispatch({
      cachedSlides: cachedData.slides || [],
      getImageURL,
      slides: assessment.slides,
      textSurvey,
      type: "reset"
    });
  }, [assessment]);

  useEffect(() => {
    if(!assessment) { return; }
    if(assessment.completed_at) { return; }
    if(assessment.started_at) { return; }

    // NOTE: catch is used to prevent the non-json response from erroring
    http.put(`/assessments/${assessment.id}/started`).catch(() => {}).then(() => {
      // NOTE: refreshAssessment() should be called after setting the cache but since nothing else
      // uses started_at, skipping it prevents an unnecessary loading state
      cache.set(assessmentCacheKey, {...assessment, started_at: Date.now()});
    });
  }, [assessment]);

  useEffect(() => {
    setShowInstructions(!!(options.showInstructions && (instructionsHTML || instructionsText)));
  }, [assessment, options.showInstructions]);

  useEffect(() => {
    if(completedSlides.length === 0) { return; }

    cache.set(cacheKey, {slides: completedSlides});
  }, [completedSlides]);

  useEffect(() => {
    if(!finished) { return; }
    if(!assessment) { return; }
    if(assessment.completed_at) { return; }
    if(submitAttempts > maxRetries) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    http.put(
      `/assessments/${assessment.id}/slides`,
      completedSlides.map(({id, response, time_taken: timeTaken}) => ({
        id,
        [likert ? "likert_response" : "response"]: response,
        time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
      }))
    ).then(() => {
      cache.remove(assessmentCacheKey);
      refreshAssessment();

      submitting.current = false;
    }).catch((response) => {
      let newError;

      try {
        newError = JSON.parse(response).errors[0];
      } catch(e) {
        newError = response;
      }

      setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      if(submitAttempts >= maxRetries) { setSubmitError(newError || "Error Submitting"); }

      submitting.current = false;
    });
  }, [finished, submitAttempts]);

  if(!assessment) { return null; }
  if(assessment.completed_at) { return null; }

  const currentSlide = slides[slideIndex];
  const props = {dispatch, likert, progress, slideIndex};

  if(error) {
    const retry = () => {
      if(!submitError) { return dispatch({type: "retry"}); }

      setSubmitAttempts(0);
      setSubmitError(null);
    };

    return (
      <Container {...props} caption={error}>
        <div className={style.error}>
          <button className={style.link} onClick={retry} type="button">
            {translate("try_again")}
          </button>
        </div>
      </Container>
    );
  }

  if(showInstructions) {
    return (
      <Container {...props} caption={translate("instructions")}>
        <div className={[style.instructions, style.slide, style.middle].join(" ")}>
          {instructionsHTML ? (
            <DangerousHTML className={style.markdown} html={instructionsHTML} />
          ) : (
            <Markdown className={style.markdown}>{instructionsText}</Markdown>
          )}
          <button onClick={() => setShowInstructions(false)} type="button">
            {translate("get_started")}
          </button>
        </div>
        {currentSlide && <Slide key={currentSlide.id} orientation="right" slide={currentSlide} />}
      </Container>
    );
  }

  if(!ready || finished) {
    return (
      <Container {...props} caption={translate("loading")}>
        <div className={style.loading}><Loading /></div>
      </Container>
    );
  }

  const lastSlide = slides[slideIndex - 1];
  const nextSlide = slides[slideIndex + 1];
  const updateSlide = (response) => {
    dispatch({index: slideIndex, response, type: "answer"});

    listener.trigger("Survey.updateSlide", {...state, response});
  };

  return (
    <Container {...props} caption={currentSlide.caption} onResponse={updateSlide}>
      {dig(lastSlide, "loaded") && <Slide key={lastSlide.id} orientation="left" slide={lastSlide} />}
      <Slide key={currentSlide.id} orientation="middle" slide={currentSlide} />
      {nextSlide && <Slide key={nextSlide.id} orientation="right" slide={nextSlide} />}
    </Container>
  );
}
