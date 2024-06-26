/* eslint-disable no-alert */
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Loading from "components/common/loading";
import style from "./style.scss";

function Slide({className = "", onSelect, onSkip: _onSkip = null, question, translate}) {
  const [answerID, setAnswerID] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const onConfirm = () => onSelect({answerId: answerID, timeTaken: Date.now() - startTime});
  const onSkip = () => {
    if(_onSkip) { return _onSkip({timeTaken: Date.now() - startTime}); }
    if(!window.confirm(translate("cognitive_confirm_skip"))) { return; }

    onSelect({skipped: true, timeTaken: Date.now() - startTime});
  };

  useEffect(() => {
    setAnswerID(null);
    setStartTime(Date.now());
  }, [question.id]);

  if(!question.loaded) { return <Loading className={className} />; }

  return (
    <div className={className}>
      <div className={style.question}>
        <img key={question.id} alt={translate("cognitive_question_alt_text")} src={question.questionImage.url} />
      </div>
      <div className={style.choices}>
        <div className={style.choicesContainer}>
          {question.responses.map(({id, image}) => (
            <div key={id} className={style.choice}>
              <button className="traitify--response-button" onClick={() => setAnswerID(id)} type="button">
                <img alt={translate("cognitive_response_alt_text")} className={answerID === id ? style.selected : null} src={image.url} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={style.buttons}>
        <button className={style.btnSkip} onClick={onSkip} type="button">{translate("cognitive_skip_button")}</button>
        <button className={`traitify--confirm-button ${style[answerID ? "btnContinue" : "btnDisabled"]}`} disabled={!answerID} onClick={answerID && onConfirm} type="button">{translate("cognitive_confirm_button")}</button>
      </div>
    </div>
  );
}

Slide.propTypes = {
  className: PropTypes.string,
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
