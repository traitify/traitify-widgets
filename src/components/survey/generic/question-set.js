import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "components/common/icon";
import useTranslate from "lib/hooks/use-translate";
import Question from "./question";
import style from "./style.scss";

function QuestionSet({first, last, onBack, onNext, set, updateAnswer}) {
  const completed = set.questions.every(({answer}) => answer);
  const translate = useTranslate();

  return (
    <div className={style.questionSet}>
      <img alt={set.text} src={set.setImage} />
      {set.questions.map((question, index) => (
        <Question
          key={question.id}
          index={index}
          question={question}
          updateAnswer={(answer) => updateAnswer({answer, question})}
        />
      ))}
      <div className={style.divider} />
      <div className={style.btnGroup}>
        {!first ? (
          <button className={style.btnBack} onClick={onBack} type="button">
            <Icon alt={translate("back")} className={style.icon} icon={faArrowLeft} />
            {translate("back")}
          </button>
        ) : <div />}
        <button
          className={["traitify--confirm-button", style[completed ? "btnTheme" : "btnDisabled"]].join(" ")}
          disabled={!completed}
          onClick={completed ? onNext : undefined}
          type="button"
        >
          {translate(last ? "submit" : "next")}
        </button>
      </div>
    </div>
  );
}

QuestionSet.propTypes = {
  first: PropTypes.bool.isRequired,
  last: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  set: PropTypes.shape({
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })).isRequired,
    setImage: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  updateAnswer: PropTypes.func.isRequired
};

export default QuestionSet;
