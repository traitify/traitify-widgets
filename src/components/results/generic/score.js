import PropTypes from "prop-types";
import style from "./style.scss";

export default function Score({assessmentResult}) {
  const totalQuestions = assessmentResult ? assessmentResult.responses.length : 0;
  const totalCorrectResponses = assessmentResult ? assessmentResult.totalCorrectResponses : 0;
  const totalIncorrectResponses = totalQuestions - totalCorrectResponses;
  const overallScore = totalQuestions > 0 ? (totalCorrectResponses / totalQuestions) * 100 : 0;

  return (
    <div className={style.score}>
      <div className={style.title}>Score</div>
      <div className={style.scoreRow}>
        <div className={style.correct}>
          <div>Correct:</div>
          <div className={style.count}>{totalCorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.incorrect}>
          <div>Incorrect:</div>
          <div className={style.count}>{totalIncorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.overall}>
          <div>Overall Score:</div>
          <div className={style.count}>{overallScore}%</div>
        </div>
      </div>
    </div>
  );
}

Score.propTypes = {
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
    ).isRequired,
    totalCorrectResponses: PropTypes.number.isRequired
  }).isRequired
};
