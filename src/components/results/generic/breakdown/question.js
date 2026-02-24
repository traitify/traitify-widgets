import {faCheck, faChevronDown, faChevronUp, faXmark} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function Question({index, open, question, toggleOpen}) {
  const translate = useTranslate();
  const optionClassName = (option) => {
    if(option.isCorrect) {
      return style[question.isCorrect ? "correctResponse" : "correctOption"];
    }

    if(option.responseOptionId === question.selectedResponseOptionId) {
      return style.incorrectResponse;
    }

    return false;
  };

  return (
    <div key={question.questionId} className={style.question}>
      <div className={style.questionTitle}>
        {question.isCorrect
          ? <Icon alt="Checked" className={style.correct} icon={faCheck} />
          : <Icon alt="X Mark" className={style.incorrect} icon={faXmark} />}
        <div className={style.wrapper}>
          <div>{translate("cognitive_question_alt_text")} {index + 1}</div>
          <button onClick={toggleOpen} className={style.toggle} type="button">
            <Icon alt="Expand" icon={open ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>
      {open && (
        <div className={style.questionContent}>
          <div className={style.questionDetails}>
            <div className={style.questionText}>{question.questionText}</div>
            <div className={style.options}>
              {question.responseOptions.map((option) => (
                <div
                  key={option.responseOptionId}
                  className={[optionClassName(option), style.option].filter(Boolean).join(" ")}
                >
                  {option.responseOptionText}
                </div>
              ))}
            </div>
          </div>
          {question.setImage && (
            <div className={style.questionImage}>
              <img alt={question.questionText} src={question.setImage} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Question.propTypes = {
  index: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  question: PropTypes.shape({
    isCorrect: PropTypes.bool.isRequired,
    questionText: PropTypes.string,
    questionId: PropTypes.string.isRequired,
    responseOptions: PropTypes.arrayOf(PropTypes.shape({
      responseOptionId: PropTypes.string.isRequired,
      responseOptionText: PropTypes.string.isRequired,
      isCorrect: PropTypes.bool.isRequired
    })).isRequired,
    selectedResponseOptionId: PropTypes.string,
    setImage: PropTypes.string
  }).isRequired,
  toggleOpen: PropTypes.func.isRequired
};

export default Question;
