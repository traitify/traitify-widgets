import {faClock} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import Instructions from "./instructions";
import Slide from "./slide";
import {useQuestionsLoader} from "./helpers";
import style from "./style.scss";

function Cognitive(props) {
  const disableTimeLimit = props.getOption("disableTimeLimit");
  const [initialQuestions, setInitialQuestions] = useState([]);
  const {dispatch, error, questions} = useQuestionsLoader(initialQuestions);
  const [disability, setDisability] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const onSelect = (answer) => {
    dispatch({answer, questionIndex, type: "response"});
    if(!onlySkipped) { return setQuestionIndex(questionIndex + 1); }

    const newQuestionIndex = questions
      .findIndex((question, index) => index > questionIndex && !question.answer);
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
    console.log("Submitting");
    // TODO: Ajax
  };

  useEffect(() => {
    if(!props.assessment) { return; }

    setInitialQuestions(props.assessment.questions);
  }, [
    props.assessment && props.assessment.questions,
    props.assessment && props.assessment.localeKey
  ]);

  useEffect(() => {
    if(disableTimeLimit) { return; }

    const calculateTimeLeft = () => {
      const allowedTime = 1000 * (disability ? 385 : 300);
      const timePassed = Date.now() - startTime;

      return (allowedTime - timePassed) / 1000;
    };

    if(!startTime) { return; }
    if(!timeLeft) { setTimeLeft(calculateTimeLeft()); }

    setTimeout(() => {
      if(submitting) { return; }

      const newTimeLeft = calculateTimeLeft();

      if(newTimeLeft > 0) {
        setTimeLeft(newTimeLeft);
      } else {
        onSubmit();
      }
    }, 1000);
  }, [startTime, timeLeft]);

  const question = questions[questionIndex];

  useEffect(() => {
    if(questions.length === 0) { return; }
    if(questions.length !== questionIndex) { return; }
    if(onlySkipped) { return onSubmit(); }

    setOnlySkipped(true);
    const newQuestionIndex = questions.findIndex(({answer}) => !answer);
    if(newQuestionIndex === -1) { return onSubmit(); }

    setQuestionIndex(newQuestionIndex);
  }, [questions, questionIndex]);

  if(questionIndex === null) { return <Instructions onStart={onStart} />; }
  if(!question) { return <Loading />; }

  // TODO: Display error?
  // TODO: Retry?
  if(error) { console.log(error); }

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = Math.floor(timeLeft % 60);
  const progress = 100.0 * (questionIndex + 1) / questions.length;

  return (
    <div className={style.container}>
      <div className={style.statusContainer}>
        {!disableTimeLimit && (
          <div className={style.timer}>
            <Icon icon={faClock} />
            &nbsp; {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
        )}
        <div className={style.status}>{questionIndex + 1} / {questions.length}</div>
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
      </div>
      <Slide onSelect={onSelect} question={question} />
    </div>
  );
}

Cognitive.defaultProps = {assessment: null};
Cognitive.propTypes = {
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    localeKey: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  getOption: PropTypes.func.isRequired
};

export {Cognitive as Component};
export default withTraitify(Cognitive);
