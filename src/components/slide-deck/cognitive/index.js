/* eslint-disable no-alert */
import {faClock} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import {update as updateQuery} from "lib/graphql/queries/cognitive";
import Icon from "lib/helpers/icon";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Instructions from "./instructions";
import Slide from "./slide";
import {useQuestionsLoader} from "./helpers";
import style from "./style.scss";

function Cognitive(props) {
  const {assessment, cache, getCognitiveAssessment, getOption, traitify, translate, ui} = props;
  const disableTimeLimit = getOption("disableTimeLimit");
  const [initialQuestions, setInitialQuestions] = useState([]);
  const {dispatch, questions} = useQuestionsLoader(initialQuestions);
  const [disability, setDisability] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [skipped, setSkipped] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
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
    if(submitting) { return; }

    setSubmitting(true);
    setTimeLeft(0);

    const answers = questions.map((question) => (
      question.answer ? ({
        answerId: question.answer.answerId,
        questionId: question.id,
        skipped: question.answer.skipped,
        timeTaken: Math.round(question.answer.timeTaken)
      }) : ({questionId: question.id})
    ));
    const query = updateQuery({
      params: {
        answers,
        testId: assessment.id,
        totalTimeTaken: startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      }
    });

    traitify.post(
      "/cognitive-tests/graphql", query
    ).then(({data: {completeCognitiveTest: {message, success}}}) => {
      console.log(success, message);
      ui.trigger("SlideDeck.finished", {props}, {message, success});
      getCognitiveAssessment({force: true});
    });
  };

  useEffect(() => {
    if(!assessment) { return; }
    if(!assessment.questions) { return; }

    const cachedData = cache.get(`cognitive.${assessment.id}`);
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

    cache.set(`cognitive.${assessment.id}`, {
      disability,
      onlySkipped,
      questions,
      questionIndex,
      skipped,
      startTime
    });
  }, [disability, onlySkipped, questions, questionIndex, skipped, startTime]);

  useEffect(() => {
    if(disableTimeLimit) { return; }
    if(!startTime) { return; }
    if(submitting) { return; }

    const calculateTimeLeft = () => {
      const timeAllowed = 1000 * assessment[disability ? "specialAllottedTime" : "allottedTime"];
      const timePassed = Date.now() - startTime;
      const _timeLeft = (timeAllowed - timePassed) / 1000;

      return _timeLeft < 0 ? 0 : _timeLeft;
    };

    if(!timeLeft) { return setTimeLeft(calculateTimeLeft()); }

    setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();

      setTimeLeft(newTimeLeft);
    }, 1000);
  }, [startTime, timeLeft]);

  useEffect(() => {
    if(disableTimeLimit) { return; }
    if(timeLeft === 0) { onSubmit(); }
  }, [timeLeft]);

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

  if(questionIndex === null) { return <Instructions onStart={onStart} translate={translate} />; }
  if(!question || submitting) { return <Loading />; }

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = Math.floor(timeLeft % 60);
  const index = skipped ? skipped.indexOf(questionIndex) : questionIndex;
  const total = skipped ? skipped.length : questions.length;
  const progress = 100.0 * (index + 1) / total;

  return (
    <div className={style.container}>
      <div className={style.statusContainer}>
        {!disableTimeLimit && (
          <div className={style.timer}>
            <Icon icon={faClock} />
            &nbsp; {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
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
  traitify: TraitifyPropTypes.traitify.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Cognitive as Component};
export default withTraitify(Cognitive);
