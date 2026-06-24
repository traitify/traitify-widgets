import {useEffect, useState} from "react";
import {useSetRecoilState} from "recoil";
import Loading from "components/common/loading";
import {errorsToText} from "lib/common/errors";
import dig from "lib/common/object/dig";
import slice from "lib/common/object/slice";
import useUpdateAssessment from "lib/hooks/requests/use-update-assessment";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useHttp from "lib/hooks/use-http";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {appendErrorState} from "lib/recoil";
import Container from "./container";
import getImageURL from "./get-image-url";
import Instructions from "./instructions";
import Slide from "./slide";
import style from "./style.scss";
import useSlideLoader from "./use-slide-loader";

export default function PersonalitySurvey() {
  const appendError = useSetRecoilState(appendErrorState);
  const assessment = useAssessment({surveyType: "personality"});
  const cache = useCache();
  const cacheKey = useCacheKey({scope: ["slides"], type: "assessment"});
  const http = useHttp();
  const listener = useListener();
  const likert = dig(assessment, "scoring_scale") === "LIKERT_CUMULATIVE_POMP";
  const textSurvey = dig(assessment, "slide_type")?.toLowerCase() === "text";
  const translate = useTranslate();
  const {
    error: loaderError,
    dispatch,
    ready,
    slideIndex,
    slides
  } = useSlideLoader({likert, textSurvey, translate});
  const options = useOption("survey") || {};
  const [showInstructions, setShowInstructions] = useState(false);
  const [started, setStarted] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const {
    attempts: submitAttempts,
    reset: resetSubmit,
    trigger: submitRequest
  } = useUpdateAssessment({
    key: "personality-submit",
    onFailure: () => setSubmitError("Error Submitting"),
    parse: (response) => response,
    save: false,
    success: () => true
  });

  const completedSlides = slides.filter(({response}) => response != null)
    .map((slide) => slice(slide, ["id", "response", "time_taken"]));
  const error = submitError || loaderError;
  const finished = slides.length > 0 && slides.length === completedSlides.length;
  const instructionsHTML = dig(assessment, "instructions", "instructional_html");
  const instructionsText = dig(assessment, "instructions", "instructional_text");
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

    dispatch({
      cachedSlides: cachedData.slides || [],
      getImageURL: options.getImageURL || getImageURL,
      slides: assessment.slides,
      textSurvey,
      type: "reset"
    });
  }, [assessment]);

  useEffect(() => {
    if(!assessment) { return; }
    if(assessment.completed_at) { return; }
    if(assessment.started_at) { return; }
    if(started) { return; }

    // NOTE: catch is used to prevent the non-json response from erroring
    http.put(`/assessments/${assessment.id}/started`).catch(() => {}).then(() => {
      setStarted(Date.now());
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

    submitRequest({
      assessment,
      request: () => http.put(
        `/assessments/${assessment.id}/slides`,
        completedSlides.map(({id, response, time_taken: timeTaken}) => ({
          id,
          [likert ? "likert_response" : "response"]: response,
          time_taken: timeTaken && timeTaken >= 0 ? timeTaken : 2
        }))
      )
    });
  }, [finished, submitAttempts]);

  useEffect(() => {
    if(!loaderError) { return; }

    appendError(errorsToText("Personality Survey", loaderError));
  }, [loaderError]);

  if(!assessment) { return null; }
  if(assessment.completed_at) { return null; }

  const currentSlide = slides[slideIndex];
  const props = {dispatch, likert, progress, slideIndex};

  if(error) {
    const retry = () => {
      if(!submitError) { return dispatch({type: "retry"}); }

      resetSubmit();
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
          <Instructions
            instructionsText={instructionsText}
            instructionsHTML={instructionsHTML}
            onNext={() => setShowInstructions(false)}
          />
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
