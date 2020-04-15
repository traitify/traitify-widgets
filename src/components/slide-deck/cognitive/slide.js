/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/loading";
import style from "./style.scss";

function Slide({onSelect, onSkip: _onSkip, question, translate}) {
  const [answerID, setAnswerID] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const timeTaken = Date.now() - startTime;
  const onConfirm = () => onSelect({answerId: answerID, timeTaken});
  const onSkip = () => {
    if(_onSkip) { return _onSkip({timeTaken}); }
    if(!window.confirm(translate("cognitive_confirm_skip"))) { return; }

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
        <img alt={translate("cognitive_question_alt_text")} src={question.questionImage.url} />
      </div>
      <div className={style.choices}>
        <div className={style.choicesContainer}>
          {question.responses.map(({id, image}) => (
            <div key={id} className={style.choice}>
              <button onClick={() => setAnswerID(id)} type="button">
                <img alt={translate("cognitive_response_alt_text")} className={answerID === id ? style.selected : null} src={image.url} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={style.buttons}>
        <button onClick={onSkip} className={style.btnSkip} type="button">{translate("cognitive_skip_button")}</button>
        <button disabled={!answerID} className={style[answerID ? "btnBlue" : "btnDisabled"]} onClick={answerID && onConfirm} type="button">{translate("cognitive_confirm_button")}</button>
      </div>
    </div>
  );
}

Slide.defaultProps = {onSkip: null};
Slide.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onSkip: PropTypes.func,
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
  }).isRequired,
  translate: PropTypes.func.isRequired
};

export default Slide;
