import PropTypes from "prop-types";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Score({assessmentResult}) {
  const translate = useTranslate();
  const totalQuestions = assessmentResult ? assessmentResult.responses.length : 0;
  const totalCorrectResponses = assessmentResult ? assessmentResult.totalCorrectResponses : 0;
  const totalIncorrectResponses = assessmentResult ? assessmentResult.totalIncorrectResponses : 0;
  const overallScore = assessmentResult ? assessmentResult.overallScore : 0;

  return (
    <div className={style.score}>
      <div className={style.title}>{translate("results.generic.score")}</div>
      <div className={style.scoreRow}>
        <div className={style.correct}>
          <div>{translate("results.generic.correct")}:</div>
          <div className={style.count}>{totalCorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.incorrect}>
          <div>{translate("results.generic.incorrect")}:</div>
          <div className={style.count}>{totalIncorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.overall}>
          <div>{translate("results.generic.overall_score")}:</div>
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
    totalCorrectResponses: PropTypes.number.isRequired,
    totalIncorrectResponses: PropTypes.number.isRequired,
    overallScore: PropTypes.number.isRequired
  }).isRequired
};
