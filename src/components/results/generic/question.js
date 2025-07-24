import {faCheck, faXmark, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useState, useEffect} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

export default function Question({question, index, showState}) {
  const [showContent, setShowContent] = useState(false);
  const responsesClassName = question.setImage
    ? style.responsesWithImage
    : style.responsesWithoutImage;

  useEffect(() => {
    setShowContent(showState);
  }, [showState]);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  return (
    <div key={question.questionId} className={style.question}>
      <div className={style.questionTitle}>
        <div>
          {question.isCorrect
            ? <Icon className={style.iconCorrect} alt="Checked" icon={faCheck} />
            : <Icon className={style.iconIncorrect} alt="X Mark" icon={faXmark} />}
        </div>
        <div> Question {index + 1}</div>
        <div>
          <button type="button" onClick={toggleContent} className={style.toggleButton}>
            <Icon className={style.icon} alt="Expand" icon={showContent ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>
      {showContent && (
        <div className={style.questionContent}>
          <div className={style.responseOptions}>
            <div className={style.questionText}>{question.questionText}</div>
            <div className={responsesClassName}>
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
                  <div
                    key={option.responseOptionId}
                    className={`${optionClassName} ${style.responseOption}`}
                  >
                    {option.responseOptionText}
                  </div>
                );
              })}
            </div>
          </div>
          {question.setImage && (
            <div className={style.questionImage}>
              <img src={question.setImage} alt={question.questionText} />
            </div>
          )}
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
    setImage: PropTypes.string,
    responseOptions: PropTypes.arrayOf(PropTypes.shape({
      responseOptionId: PropTypes.string.isRequired,
      responseOptionText: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired
    })).isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  showState: PropTypes.bool.isRequired
};
