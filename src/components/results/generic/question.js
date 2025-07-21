import {faCheck, faXmark, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

export default function Question({question, index}) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div key={question.questionId} className={style.question}>
      <div className={style.questionTitle}>
        <div>
          {question.isCorrect
            ? <Icon className={style.iconCorrect} alt="Checked" icon={faCheck} />
            : <Icon className={style.iconIncorrect} alt="X Mark" icon={faXmark} />}
        </div>
        <div> Question {index + 1}</div>
        <div className={style.toggleButtonWrapper}>
          <button type="button" onClick={() => setShowContent(!showContent)} className={style.toggleButton}>
            <Icon className={style.icon} alt="Expand" icon={showContent ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>
      {showContent && (
        <div className={style.questionContent}>
          <div className={style.responseOptions}>
            <div className={style.questionText}>{question.questionText}</div>
            {question.responseOptions.map((option) => {
              let optionClassName = "";
              if(question.isCorrect) {
                optionClassName = option.isCorrect ? style.correctResponse : "";
              } else {
                if(option.isCorrect) {
                  optionClassName = style.correctOption;
                } else if(option.responseOptionId === question.selectedResponseOptionId) {
                  optionClassName = style.incorrectResponse;
                }
              }
              return (
                <div className={`${optionClassName} ${style.responseOption}`} key={option.responseOptionId}>
                  {option.responseOptionText}
                </div>
              );
            })}
          </div>
          <div className={style.questionImage}>
            <img src="//images.ctfassets.net/4pzvszxmf15y/3HIUe5W3dB5dmGUKcQegZM/a539a141bb6bbd56e95355684b1ba942/069933fe23e6bd36bab24fd91be5e835.png" alt="Question illustration" />
          </div>
        </div>
      )}
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.shape({
    questionText: PropTypes.string,
    questionId: PropTypes.string.isRequired,
    isCorrect: PropTypes.bool.isRequired,
    selectedResponseOptionId: PropTypes.string,
    responseOptions: PropTypes.arrayOf(PropTypes.shape({
      responseOptionId: PropTypes.string.isRequired,
      responseOptionText: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired
    })).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};
