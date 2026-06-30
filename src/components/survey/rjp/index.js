import {faCirclePlay as faPlay} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowRotateLeft as faReplay,
  faCircleCheck as faCheck,
  faCircleXmark as faX
} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useMemo, useRef, useState} from "react";
import AccommodationButton from "components/common/accommodation/button";
import AccommodationModal from "components/common/accommodation/modal";
import HelpButton from "components/common/help/button";
import HelpModal from "components/common/help/modal";
import Icon from "components/common/icon";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import dig from "lib/common/object/dig";
import {isNumber} from "lib/common/object/type";
import useStartAssessment from "lib/hooks/requests/graphql/use-start-assessment";
import useUpdateAssessment from "lib/hooks/requests/graphql/use-update-assessment";
import useAssessment from "lib/hooks/use-assessment";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useOption from "lib/hooks/use-option";
import useSkipAssessment from "lib/hooks/use-skip-assessment";
import useSurvey from "lib/hooks/use-survey";
import useTranslate from "lib/hooks/use-translate";
import Modal from "./modal";
import style from "./style.scss";

const urlFrom = (url) => (url?.startsWith("//") ? `https://${url}` : url);

export default function RJP() {
  const assessment = useAssessment({surveyType: "rjp"});
  const graphQL = useGraphql();
  const container = useRef(null);
  const playTile = useRef(null);
  const showHelp = useOption("showHelp");
  const [showAccommodation, setShowAccommodation] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {allow: allowSkip} = useSkipAssessment();
  const survey = useSurvey({surveyType: "rjp"});
  const translate = useTranslate();

  const {trigger: startAssessment} = useStartAssessment({key: "rjp-start", path: graphQL.rjp.path});
  const {trigger: completeRequest} = useUpdateAssessment({
    key: "rjp-complete",
    onSuccess: () => container.current?.scrollIntoView({behavior: "smooth", block: "start"}),
    parse: (response) => response.data.optOutAssessment,
    path: graphQL.rjp.path,
    success: (data) => !!data?.completedAt
  });
  const {
    attempts: submitAttempts,
    requesting: submitting,
    trigger: submitRequest
  } = useUpdateAssessment({
    key: "rjp-submit",
    parse: (response) => response.data.updateAssessment,
    path: graphQL.rjp.path,
    success: (data) => isNumber(data?.totalCorrectResponses)
  });
  const [responses, setResponses] = useState({});
  const [showQuestions, setShowQuestions] = useState(false);
  const video = useMemo(() => dig(assessment, "videos", 0), [assessment]);
  const state = {assessment, responses};

  const onComplete = ({optedOut}) => completeRequest({
    assessment,
    query: graphQL.rjp.optOutAssessment,
    variables: {id: assessment.id, optedOut}
  });
  const onContinue = () => onComplete({optedOut: false});
  const onOptOut = () => onComplete({optedOut: true});
  const onStart = () => {
    setShowQuestions(true);
    startAssessment({
      assessment,
      query: graphQL.rjp.start,
      variables: {id: assessment.id}
    });
  };
  const onSubmit = () => submitRequest({
    assessment,
    query: graphQL.rjp.update,
    variables: {
      answers: assessment.responses.map((response) => ({
        questionId: response.questionId,
        selectedResponseOptionId: responses[response.questionId]
      })),
      deferredComplete: true,
      id: assessment.id
    }
  });

  useComponentEvents("Survey", {...state});
  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);
  useEffect(() => {
    if(!assessment) { return; }
    if(video) { return; }

    onStart();
  }, [assessment, video]);

  useEffect(() => {
    if(!assessment) { return; }
    if(!assessment.responses) { return; }
    if(Object.keys(responses).length > 0) { return; }

    const existingResponses = assessment.responses.map((response) => [
      response.questionId,
      response.selectedResponseOptionId
    ]).filter((response) => response[1]);
    if(existingResponses.length === 0) { return; }

    setResponses(Object.fromEntries(existingResponses));
    setShowQuestions(true);
  }, [assessment]);

  useEffect(() => {
    if(!showQuestions) { return; }

    playTile.current?.scrollIntoView({behavior: "smooth", block: "start"});
    playTile.current?.focus({preventScroll: true});
  }, [showQuestions]);

  if(!assessment) { return null; }
  if(assessment.completedAt) { return null; }
  if(!survey) { return null; }
  if(!assessment.responses) {
    return (
      <div className={[style.container, style.loading].join(" ")}>
        <Loading />
      </div>
    );
  }

  const onPlay = () => setShowModal(true);
  const onSelect = ({question, response}) => {
    const updatedResponses = {...responses};
    updatedResponses[question.questionId] = response.responseOptionId;

    setResponses(updatedResponses);
  };
  const answered = assessment.responses.length === Object.keys(responses).length;

  return (
    <div className={style.container} ref={container}>
      <div className={style.heading}>
        {translate("survey.rjp.instructions.heading")}
        {showHelp ? <HelpButton onClick={() => setShowHelpModal(true)} /> : <div />}
      </div>
      <Markdown className={style.text}>{assessment.instructions}</Markdown>
      {video && (
        <button className={style.play} onClick={onPlay} ref={playTile} type="button">
          <img alt={translate("play")} src={urlFrom(video.thumbnailUrl)} />
          <Icon alt={translate("play")} icon={showQuestions ? faReplay : faPlay} />
        </button>
      )}
      {(allowSkip || video) && (
        <div className={style.btnGroup}>
          {allowSkip && <AccommodationButton onClick={() => setShowAccommodation(true)} />}
          {video && (
            <button
              className={`traitify--response-button ${style.btnTheme}`}
              onClick={onPlay}
              type="button"
            >
              {translate(`survey.rjp.instructions.${showQuestions ? "replay" : "play"}`)}
            </button>
          )}
        </div>
      )}
      {showQuestions && (
        <div>
          <div className={style.divider} />
          <div className={style.heading}>{translate("survey.rjp.questions.heading")}</div>
          {assessment.responses.map((question) => (
            <div key={question.questionId}>
              <div className={style.p}>{question.questionText}</div>
              <div className={style.options}>
                {question.responseOptions.map((option) => (
                  <button
                    className={[
                      "traitify--response-button",
                      responses[question.questionId] === option.responseOptionId && style.active
                    ].filter(Boolean).join(" ")}
                    key={option.responseOptionId}
                    onClick={() => onSelect({question, response: option})}
                    type="button"
                  >
                    {option.responseOptionText}
                  </button>
                ))}
              </div>
              <div className={style.divider} />
            </div>
          ))}
          {isNumber(assessment.totalCorrectResponses) ? (
            <div>
              <div>
                {assessment.isFit ? (
                  <div>
                    <div className={style.fit}>
                      <Icon className={style.success} icon={faCheck} />
                      <div>{survey.fitResultHeader}</div>
                    </div>
                    <div className={style.p}>{survey.fitResultBody}</div>
                  </div>
                ) : (
                  <div>
                    <div className={style.fit}>
                      <Icon className={style.danger} icon={faX} />
                      <div>{survey.noFitResultHeader}</div>
                    </div>
                    <div className={style.p}>{survey.noFitResultBody}</div>
                  </div>
                )}
              </div>
              <div className={style.btnGroup}>
                <button
                  className={`traitify--response-button ${style.btnOutline}`}
                  onClick={onContinue}
                  type="button"
                >
                  {survey.proceedButtonText || translate("survey.rjp.match.continue")}
                </button>
                <button
                  className={`traitify--response-button ${style.btnOutline}`}
                  onClick={onOptOut}
                  type="button"
                >
                  {survey.optOutButtonText || translate("survey.rjp.match.opt_out")}
                </button>
              </div>
            </div>
          ) : (
            <div className={style.btnGroup}>
              <button
                className={`traitify--response-button ${answered ? style.btnTheme : style.btnOutline}`}
                onClick={answered ? onSubmit : null}
                type="button"
              >
                {submitting.current ? translate("loading") : translate("survey.rjp.questions.submit")}
              </button>
            </div>
          )}
        </div>
      )}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onReady={onStart}
          url={urlFrom(video?.videoUrl)}
        />
      )}
      {showAccommodation && (
        <AccommodationModal show={showAccommodation} setShow={setShowAccommodation} />
      )}
      {showHelpModal && <HelpModal show={showHelpModal} setShow={setShowHelpModal} />}
    </div>
  );
}
