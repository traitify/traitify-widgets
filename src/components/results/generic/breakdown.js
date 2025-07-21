import PropTypes from "prop-types";
import Question from "./question";
import style from "./style.scss";

export default function Breakdown({assessmentResult}) {
  return (
    <div className={style.breakdown}>
      <div className={style.header}>
        <div>
          <div className={style.title}>Breakdown</div>
          <span>Here is the breakdown of the questions you answered in the assessment</span>
        </div>
        <div className={style.toggleButtonWrapper}>
          <button className={style.toggleButton} type="button">Show/Hide All</button>
        </div>
      </div>
      <div className={style.questions}>
        {assessmentResult.responses.map((question, index) => (
          <Question key={question.questionId} question={question} index={index} />
        ))}
      </div>
    </div>
  );
}

Breakdown.propTypes = {
  assessmentResult: PropTypes.shape({
    responses: PropTypes.arrayOf(
      PropTypes.shape({
        questionId: PropTypes.string.isRequired,
        questionText: PropTypes.string,
        isCorrect: PropTypes.bool.isRequired,
        selectedResponseOptionId: PropTypes.string,
        responseOptions: PropTypes.arrayOf(
          PropTypes.shape({
            responseOptionId: PropTypes.string.isRequired,
            responseOptionText: PropTypes.string.isRequired,
            isCorrect: PropTypes.bool
          })
        ).isRequired
      })
    ).isRequired
  }).isRequired
};
