/* eslint-disable jsx-a11y/media-has-caption, no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/common/loading";
import Markdown from "components/common/markdown";
import useWindowSize from "lib/hooks/use-window-size";
import {useQuestionsLoader, videoProps} from "./helpers";
import Slide from "./slide";
import style from "./style.scss";

function Practice({onFinish, practiceExplanations, practiceQuestions, translate}) {
  const [width] = useWindowSize();
  const [type, setType] = useState(width > 768 ? "h" : "v");
  const [questionIndex, setQuestionIndex] = useState(0);
  const {dispatch, questions} = useQuestionsLoader(practiceQuestions);
  const onNext = () => setQuestionIndex(questionIndex + 1);
  const onSelect = (answer) => {
    dispatch({answer, questionIndex, type: "response"});
  };

  useEffect(() => { setType(width > 768 ? "h" : "v"); }, [width]);
  useEffect(() => {
    if(questions.length !== questionIndex) { return; }

    onFinish();
  }, [questionIndex]);

  const explanation = practiceExplanations[questionIndex];
  const instructionOptions = {translate, type};
  const question = questions[questionIndex];

  if(!question) { return <Loading />; }
  if(question.answer) {
    const answer = question.answer.answerId === question.correctAnswerID ? "correct" : "incorrect";
    const {button, heading, text, video} = typeof explanation === "function" ? explanation(instructionOptions) : explanation;

    return (
      <div key={`question-${questionIndex + 1}-${type}`} className={style.container}>
        <h1>{heading}</h1>
        <p className={style.center}>{translate(`cognitive_practice_answer_${answer}`)}</p>
        {text && <Markdown className={style.text}>{text}</Markdown>}
        {video && <video {...videoProps}><source src={video} type="video/mp4" /></video>}
        <button className={`traitify--response-button ${style.btnBlue}`} onClick={onNext} type="button">{button}</button>
      </div>
    );
  }

  const progress = (100.0 * (questionIndex + 1)) / questions.length;
  const onSkip = () => window.alert(translate("cognitive_alert_skip"));

  return (
    <div key="practice" className={style.container}>
      <div className={style.statusContainer}>
        <div className={style.timer}>{translate("cognitive_practice_heading")}</div>
        <div className={style.status}>{questionIndex + 1} / {questions.length}</div>
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
      </div>
      <Slide
        onSelect={onSelect}
        onSkip={onSkip}
        question={questions[questionIndex]}
        translate={translate}
      />
    </div>
  );
}

Practice.propTypes = {
  onFinish: PropTypes.func.isRequired,
  practiceExplanations: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.shape({
        button: PropTypes.string.isRequired,
        heading: PropTypes.string.isRequired,
        text: PropTypes.string,
        video: PropTypes.string
      }).isRequired
    ]).isRequired
  ).isRequired,
  practiceQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      correctAnswerID: PropTypes.string.isRequired,
      questionImage: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
      responses: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired
        }).isRequired
      ).isRequired
    }).isRequired
  ).isRequired,
  translate: PropTypes.func.isRequired
};

export default Practice;
