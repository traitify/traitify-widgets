/* eslint-disable no-alert */
import {useEffect, useRef, useState} from "react";
import {useRecoilRefresher_UNSTABLE as useRecoilRefresher} from "recoil";
import Loading from "components/common/loading";
import useAssessment from "lib/hooks/use-assessment";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useComponentEvents from "lib/hooks/use-component-events";
import useDidUpdate from "lib/hooks/use-did-update";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {cognitiveAssessmentQuery} from "lib/recoil";
import Instructions from "./instructions";
import Slide from "./slide";
import Timer from "./timer";
import {useQuestionsLoader} from "./helpers";
import style from "./style.scss";

export default function Cognitive() {
  const assessment = useAssessment("cognitive");
  const assessmentCacheKey = useCacheKey("assessment");
  const cache = useCache();
  const cacheKey = useCacheKey({scope: ["slides"], type: "assessment"});
  const graphQL = useGraphql();
  const http = useHttp();
  const options = useOption("survey") || {};
  const refreshAssessment = useRecoilRefresher(cognitiveAssessmentQuery);
  const translate = useTranslate();

  const [initialQuestions, setInitialQuestions] = useState([]);
  const {dispatch, questions} = useQuestionsLoader(initialQuestions);
  const [disability, setDisability] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [skipped, setSkipped] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const submitting = useRef(false);
  const state = {
    disability,
    dispatch,
    initialQuestions,
    questions,
    onlySkipped,
    questionIndex,
    skipped,
    startTime
  };
  const onSelect = (answer) => {
    dispatch({answer, questionIndex, type: "response"});
    if(!onlySkipped) { return setQuestionIndex(questionIndex + 1); }

    const newQuestionIndex = questions
      .findIndex((question, index) => index > questionIndex && !question.answer.answerId);
    setQuestionIndex(newQuestionIndex === -1 ? questions.length + 1 : newQuestionIndex);
  };
  const onStart = (_options) => {
    if(_options.disability) { setDisability(true); }

    setQuestionIndex(0);
    setStartTime(Date.now());
  };
  const onSubmit = () => {
    if(assessment.completed) { return; }
    if(submitAttempts > 3) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    const query = graphQL.cognitive.update;
    const variables = {
      answers: questions.map((question) => (
        question.answer ? ({
          answerId: question.answer.answerId,
          questionId: question.id,
          skipped: question.answer.skipped || false,
          timeTaken: question.answer.timeTaken < 1 ? 1 : question.answer.timeTaken
        }) : ({
          questionId: question.id,
          skipped: true, // Currently required by API
          timeTaken: 1 // Currently required by API
        })
      )),
      learningDisability: disability,
      overallTimeTaken: startTime ? parseInt((Date.now() - startTime) / 1000, 10) : 1000,
      testID: assessment.id
    };

    http.post(graphQL.cognitive.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.completeCognitiveTest.success) {
        cache.set(assessmentCacheKey, {...assessment, completed: true});
        refreshAssessment();

        submitting.current = false;
      } else {
        console.warn(errors || data); // eslint-disable-line no-console

        submitting.current = false;

        setTimeout(() => setSubmitAttempts((x) => x + 1), 2000);
      }
    });
  };

  useComponentEvents("Survey", {...state});
  useDidUpdate(() => { onSubmit(); }, [submitAttempts]);
  useEffect(() => {
    if(!assessment) { return; }

    const cachedData = cache.get(cacheKey);
    if(cachedData) {
      setDisability(cachedData.disability);
      setOnlySkipped(cachedData.onlySkipped);
      setSkipped(cachedData.skipped);

      setQuestionIndex(cachedData.questionIndex);
      setInitialQuestions(cachedData.questions);
      setStartTime(cachedData.startTime);
    } else {
      setInitialQuestions(assessment.questions);
    }
  }, [
    assessment && assessment.questions,
    assessment && assessment.localeKey
  ]);

  useEffect(() => {
    if(!assessment) { return; }
    if(questions.length === 0) { return; }

    cache.set(cacheKey, {
      disability,
      onlySkipped,
      questions,
      questionIndex,
      skipped,
      startTime
    });
  }, [disability, onlySkipped, questions, questionIndex, skipped, startTime]);

  useEffect(() => {
    if(questions.length === 0) { return; }
    if(questions.length > questionIndex) { return; }
    if(onlySkipped) { return onSubmit(); }

    setOnlySkipped(true);

    const skippedIndexes = questions
      .map(({answer}, index) => ({answer, index}))
      .filter(({answer}) => !answer.answerId)
      .map(({index}) => index);

    if(skippedIndexes.length === 0) { return onSubmit(); }
    if(window.confirm(translate("cognitive_confirm_retry"))) {
      setSkipped(skippedIndexes);
      setQuestionIndex(skippedIndexes[0]);
    } else {
      return onSubmit();
    }
  }, [questions, questionIndex]);
  const question = questions[questionIndex];
  const nextQuestion = questions[questionIndex + 1];

  if(!assessment) { return null; }
  if(assessment.completed) { return null; }
  if(questionIndex === null) {
    return (
      <Instructions
        captureLearningDisability={options.captureLearningDisability}
        initialLearningDisability={options.initialLearningDisability}
        onStart={onStart}
        options={options}
        translate={translate}
      />
    );
  }
  if(!question || submitting.current) { return <Loading />; }

  const index = skipped ? skipped.indexOf(questionIndex) : questionIndex;
  const total = skipped ? skipped.length : questions.length;
  const progress = (100.0 * (index + 1)) / total;

  return (
    <div className={style.container}>
      <div className={style.statusContainer}>
        {!options.disableTimeLimit && (
          <Timer
            onFinish={onSubmit}
            startTime={startTime}
            timeAllowed={
              disability
                ? options.specialTimeLimit || assessment.specialAllottedTime
                : options.timeLimit || assessment.allottedTime
            }
          />
        )}
        <div className={style.status}>
          {skipped && <span>{translate("cognitive_skipped_questions")} </span>}
          <span>{index + 1} / {total}</span>
        </div>
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
      </div>
      <Slide
        onSelect={onSelect}
        question={question}
        translate={translate}
      />
      {nextQuestion && (
        <Slide
          className={style.hide}
          onSelect={onSelect}
          question={nextQuestion}
          translate={translate}
        />
      )}
    </div>
  );
}
