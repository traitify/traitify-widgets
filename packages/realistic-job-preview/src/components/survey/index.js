import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import Icon from "traitify/components/common/icon";
import Loading from "traitify/components/common/loading";
import dig from "traitify/lib/common/object/dig";
import useDidUpdate from "traitify/lib/hooks/use-did-update";
import * as graphql from "lib/graphql/assessment";
import useAssessment from "lib/hooks/use-assessment";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useDataRefresh from "lib/hooks/use-data-refresh";
import useTranslate from "lib/hooks/use-translate";
import useWidgetContext from "lib/hooks/use-widget-context";
import Instructions from "./instructions";
import style from "./style.scss";

const testing = true;
const createTestingData = ({id, localeKey, ...assessment}) => ({
  data: {
    updateRealisticJobPreviewAssessment: {
      ...assessment,
      completedAt: Date.now(),
      localeKey,
      rjpId: id
    }
  }
});

export default function Survey() {
  const assessment = useAssessment();
  const cacheKey = useCacheKey({type: "assessment"});
  const refreshAssessment = useDataRefresh({key: cacheKey});
  const {assessmentID, cache, locale, http} = useWidgetContext();
  const [questionIndex, setQuestionIndex] = useState(null);
  const [responses, setResponses] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const submitting = useRef(false);
  const translate = useTranslate();

  const question = dig(assessment, "responses", questionIndex);
  const state = {assessment, question, questionIndex};
  const onBack = () => {
    setQuestionIndex(questionIndex > 0 ? questionIndex - 1 : 0);
  };
  const onSelect = (response) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = {
      questionId: question.questionID,
      questionText: question.questionText,
      selectedResponseOptionId: response.responseOptionId,
      selectedResponseOptionText: response.responseOptionText
    };

    setResponses(updatedResponses);
    setQuestionIndex(questionIndex + 1);
  };
  const onStart = () => {
    setQuestionIndex(0);
    setStartTime(Date.now());
  };
  const onSubmit = async() => {
    if(assessment.completedAt) { return; }
    if(submitAttempts > 3) { return; }
    if(submitting.current) { return; }

    const params = {
      query: graphql.update,
      variables: {
        id: assessmentID,
        localeKey: locale,
        responses,
        startTime
      }
    };
    const response = testing
      ? createTestingData({assessment, ...params.variables})
      : await http.post(graphql.path, params).catch((errors) => ({errors}));

    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      setSubmitAttempts((x) => x + 1);
      return;
    }

    const data = response.data.updateRealisticJobPreviewAssessment;
    data.id = data.rjpId;

    if(data.completedAt) {
      cache.set(cacheKey, data);
      refreshAssessment();
    }
  };

  useComponentEvents("Survey", {...state});
  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);
  useEffect(() => {
    if(!assessment) { return; }
    if(!questionIndex) { return; }
    if(questionIndex < assessment.responses.length) { return; }

    onSubmit();
  }, [questionIndex]);
  useEffect(() => {
    if(!assessment) { return; }

    setQuestionIndex(null);
  }, [assessment?.localeKey]);

  if(!assessment) { return null; }
  if(assessment.completedAt) { return null; }
  if(questionIndex === null) { return <Instructions onStart={onStart} />; }
  if(!question || submitting.current) {
    return (
      <div className={[style.container, style.loading].join(" ")}>
        <Loading />
      </div>
    );
  }

  const progress = (questionIndex / assessment.responses.length) * 100;

  return (
    <div className={style.container}>
      <div className={style.progressBar}>
        <div className={style.progress} style={{width: `${progress}%`}} />
      </div>
      <div className={style.text}>{question.questionText}</div>
      <div className={style.divider} />
      <div className={style.options}>
        {question.responseOptions.map((option) => (
          <button
            className="traitify--response-button"
            key={option.responseOptionId}
            onClick={() => onSelect(option)}
            type="button"
          >
            {option.responseOptionText}
          </button>
        ))}
      </div>
      <div>
        <button className={style.back} onClick={onBack} type="button">
          <Icon alt={translate("back")} icon={faArrowLeft} /> {translate("back")}
        </button>
      </div>
    </div>
  );
}
