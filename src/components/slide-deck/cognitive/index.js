/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useRef, useState} from "react";
import Loading from "components/loading";
import {update as updateQuery} from "lib/graphql/queries/cognitive";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Instructions from "./instructions";
import Slide from "./slide";
import Timer from "./timer";
import {useQuestionsLoader} from "./helpers";
import style from "./style.scss";

function Cognitive(props) {
  const {
    assessment,
    cache,
    getCognitiveAssessment,
    getOption,
    isReady,
    traitify,
    translate,
    ui
  } = props;
  const disableTimeLimit = getOption("disableTimeLimit");
  const [initialQuestions, setInitialQuestions] = useState([]);
  const {dispatch, questions} = useQuestionsLoader(initialQuestions);
  const [disability, setDisability] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [skipped, setSkipped] = useState(null);
  const [startTime, setStartTime] = useState(null);
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
  const onStart = (options) => {
    if(options.disability) { setDisability(true); }

    setQuestionIndex(0);
    setStartTime(Date.now());
  };
  const onSubmit = () => {
    if(isReady("results")) { return; }
    if(submitting.current) { return; }

    submitting.current = true;

    const answers = questions.map((question) => (
      question.answer ? ({
        answerId: question.answer.answerId,
        questionId: question.id,
        skipped: question.answer.skipped,
        timeTaken: question.answer.timeTaken
      }) : ({
        questionId: question.id,
        skipped: true, // Currently required by API
        timeTaken: 1 // Currently required by API
      })
    ));
    const query = updateQuery({
      params: {
        answers,
        overallTimeTaken: startTime ? Date.now() - startTime : 1,
        testId: assessment.id
      }
    });

    traitify.post(
      "/cognitive-tests/graphql", query
    ).then(() => {
      ui.trigger("SlideDeck.finished", {props, state});
      // If actual results are shown, use this, but for now it won't work because the API is async
      // getCognitiveAssessment({force: true});
      const key = `${assessment.localeKey.toLowerCase()}.cognitive-assessment.${assessment.id}`;
      cache.set(key, {...assessment, completed: true});
      getCognitiveAssessment();
    });
  };

  useDidMount(() => { ui.trigger("SlideDeck.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("SlideDeck.updated", {props, state}); });
  useEffect(() => {
    if(!assessment) { return; }

    const cachedData = cache.get(`cognitive.slide-deck.${assessment.id}`);
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

    cache.set(`cognitive.slide-deck.${assessment.id}`, {
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

  if(isReady("results")) { return null; }
  if(questionIndex === null) { return <Instructions onStart={onStart} translate={translate} />; }
  if(!question || submitting.current) { return <Loading />; }

  const index = skipped ? skipped.indexOf(questionIndex) : questionIndex;
  const total = skipped ? skipped.length : questions.length;
  const progress = 100.0 * (index + 1) / total;

  return (
    <div className={style.container}>
      <div className={style.statusContainer}>
        {!disableTimeLimit && (
          <Timer
            onFinish={onSubmit}
            startTime={startTime}
            timeAllowed={assessment[disability ? "specialAllottedTime" : "allottedTime"]}
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
      <Slide onSelect={onSelect} question={question} translate={translate} />
    </div>
  );
}

Cognitive.defaultProps = {assessment: null};
Cognitive.propTypes = {
  assessment: PropTypes.shape({
    allottedTime: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    localeKey: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    specialAllottedTime: PropTypes.number.isRequired
  }),
  cache: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired
  }).isRequired,
  getCognitiveAssessment: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  traitify: TraitifyPropTypes.traitify.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Cognitive as Component};
export default withTraitify(Cognitive);
