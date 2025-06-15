import PropTypes from "prop-types";
import Responses from "./responses";
import style from "./style.scss";

export default function QuestionSet({questionSet, updateSlide = null}) {
  const questionSetClass = [style.questionSet].join(" ");

  return (
    <div className={questionSetClass}>
      <img src={questionSet.setImage} alt={questionSet.text} />
      <hr />
      {questionSet.questions.map((question) => (
        <div key={question.id}>
          <h3 className={style.question}>{question.text}</h3>
          <Responses
            responseOptions={question.responseOptions}
            updateSlide={(optionId) => updateSlide(question.id, optionId)}
          />
        </div>
      ))}
    </div>
  );
}

QuestionSet.propTypes = {
  questionSet: PropTypes.shape({
    text: PropTypes.string.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })).isRequired,
    setImage: PropTypes.string.isRequired
  }).isRequired,
  updateSlide: PropTypes.func
};
