/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import Slide from "./slide";
import {useQuestionsLoader} from "./helpers";
import practiceQuestions from "./practice-questions";
import style from "./style.scss";

function Practice({onFinish, translate}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const {dispatch, questions} = useQuestionsLoader(practiceQuestions);
  const onNext = () => setQuestionIndex(questionIndex + 1);
  const onSelect = (answer) => {
    dispatch({answer, questionIndex, type: "response"});
  };

  useEffect(() => {
    if(questions.length === 0) { return; }
    if(questions.length !== questionIndex) { return; }

    onFinish();
  }, [questionIndex]);

  const question = questions[questionIndex];

  if(!question) { return <Loading />; }
  if(question.answer) {
    if(questionIndex === 0) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-1.mp4";

      return (
        <div className={style.instructions}>
          <h1>{translate("cognitive_practice_step_1_heading")}</h1>
          <p>{translate("cognitive_practice_step_1_text")}</p>
          <video autoPlay={true} loop={true} muted={true} playsInline={true}><source src={image} type="video/mp4" /></video>
          <button className={style.btnBlue} onClick={onNext} type="button">{translate("cognitive_practice_step_1_button")}</button>
        </div>
      );
    }

    if(questionIndex === 1) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-2.mp4";

      return (
        <div className={style.instructions}>
          <h1>{translate("cognitive_practice_step_2_heading")}</h1>
          <p>{translate("cognitive_practice_step_2_text")}</p>
          <video autoPlay={true} loop={true} muted={true} playsInline={true}><source src={image} type="video/mp4" /></video>
          <button className={style.btnBlue} onClick={onNext} type="button">{translate("cognitive_practice_step_2_button")}</button>
        </div>
      );
    }

    if(questionIndex === 2) {
      const image = "https://cdn.traitify.com/images/cognitive/practice-3.mp4";

      return (
        <div className={style.instructions}>
          <h1>{translate("cognitive_practice_step_3_heading")}</h1>
          <video autoPlay={true} loop={true} muted={true} playsInline={true}><source src={image} type="video/mp4" /></video>
          <p>{translate("cognitive_practice_step_3_text")}</p>
          <button className={style.btnBlue} onClick={onNext} type="button">{translate("cognitive_practice_step_3_button")}</button>
        </div>
      );
    }
  }

  const progress = 100.0 * (questionIndex + 1) / questions.length;
  const onSkip = () => window.alert(translate("cognitive_alert_skip"));

  return (
    <div className={style.instructions}>
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
  translate: PropTypes.func.isRequired
};

export default Practice;
