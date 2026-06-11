import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher, useSetRecoilState} from "recoil";
import Icon from "components/common/icon";
import Loading from "components/common/loading";
import {responseToErrors} from "lib/common/errors";
import dig from "lib/common/object/dig";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useTranslate from "lib/hooks/use-translate";
import {activeAssessmentQuery, appendErrorState} from "lib/recoil";
import Instructions from "./instructions";
import style from "./style.scss";

export default function RJP() {
  const appendError = useSetRecoilState(appendErrorState);
  const assessment = useAssessment({surveyType: "rjp"});
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const graphQL = useGraphql();
  const http = useHttp();
  const refreshAssessment = useRecoilRefresher(activeAssessmentQuery);
  const translate = useTranslate();

  const [questionIndex, setQuestionIndex] = useState(null);
  const [responses, setResponses] = useState([]);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const submitting = useRef(false);

  const question = dig(assessment, "responses", questionIndex);
  const state = {assessment, question, questionIndex};
  const onBack = () => {
    setQuestionIndex(questionIndex > 0 ? questionIndex - 1 : 0);
  };
  const onSelect = (response) => {
    const updatedResponses = [...responses];
    updatedResponses[questionIndex] = {
      questionId: question.questionId,
      selectedResponseOptionId: response.responseOptionId
    };

    setResponses(updatedResponses);
    setQuestionIndex(questionIndex + 1);
  };
  const onStart = async() => {
    setQuestionIndex(0);

    if(assessment.startedAt) { return; }

    const {path} = graphQL.rjp;
    const params = {
      query: graphQL.rjp.start,
      variables: {id: assessment.id}
    };
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("rjp-start", response.errors); /* eslint-disable-line no-console */
      appendError(responseToErrors({method: "POST", path, response}));
    }
  };
  const onSubmit = async() => {
    if(assessment.completedAt) { return; }
    if(submitAttempts > 3) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    const {path} = graphQL.rjp;
    const params = {
      query: graphQL.rjp.update,
      variables: {
        answers: responses,
        id: assessment.id
      }
    };
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("rjp-submit", response.errors); /* eslint-disable-line no-console */
      appendError(responseToErrors({method: "POST", path, response}));
      submitting.current = false;
      setSubmitAttempts((x) => x + 1);
      return;
    }

    const data = response.data.updateAssessmentAnswer;
    if(data?.completedAt) {
      cache.set(assessmentCacheKey, data);
      submitting.current = false;
      refreshAssessment();
    } else {
      submitting.current = false;
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
