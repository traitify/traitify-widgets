/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import style from "./style.scss";

function Slide({onSelect, question}) {
  const [answerID, setAnswerID] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const timeTaken = (Date.now() - startTime) / 1000;
  const onConfirm = () => onSelect({answerId: answerID, timeTaken});
  const onSkip = () => {
    if(!window.confirm("Are you sure you want to skip?")) { return; }

    onSelect({skipped: true, timeTaken});
  };

  useEffect(() => {
    setAnswerID(null);
    setStartTime(Date.now());
  }, [question.id]);

  if(!question.loaded) { return <Loading />; }

  return (
    <div>
      <div className={style.question}>
        <img alt="Question" src={question.questionImage.url} />
      </div>
      <div className={style.choices}>
        <div className={style.choicesContainer}>
          {question.responses.map(({id, image}) => (
            <button key={id} onClick={() => setAnswerID(id)} type="button">
              <img alt="Response" className={answerID === id ? style.selected : null} src={image.url} />
            </button>
          ))}
        </div>
      </div>
      <div className={style.buttons}>
        <button onClick={onSkip} className={style.btnSkip} type="button">Skip</button>
        <button disabled={!answerID} className={style[answerID ? "btnBlue" : "btnDisabled"]} onClick={answerID && onConfirm} type="button">Confirm</button>
      </div>
    </div>
  );
}

Slide.propTypes = {
  onSelect: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    questionImage: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired,
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        image: PropTypes.shape({url: PropTypes.string.isRequired}).isRequired
      })
    )
  }).isRequired
};

export default Slide;
