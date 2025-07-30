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
  const longTextCondition = (option) => option.responseOptionText.length > 20;
  const longTextResponses = question.responseOptions.some(longTextCondition);
  const optionsDirection = (longTextResponses || responsesClassName === style.responsesWithImage)
    ? "column"
    : "row";

  useEffect(() => {
    setShowContent(showState);
  }, [showState]);

  const toggleContent = () => {
    setShowContent(!showContent);
  };

  const optionClassName = (option) => {
    let className = "";
    if(question.isCorrect) {
      className = option.isCorrect ? style.correctResponse : "";
    } else {
      if(option.isCorrect) {
        className = style.correctOption;
      } else if(option.responseOptionId === question.selectedResponseOptionId) {
        className = style.incorrectResponse;
      }
    }
    return className;
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
            <div className={responsesClassName} style={{flexDirection: optionsDirection}}>
              {question.responseOptions.map((option) => (
                <div
                  key={option.responseOptionId}
                  className={`${optionClassName(option)} ${style.responseOption}`}
                >
                  {option.responseOptionText}
                </div>
              ))}
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
