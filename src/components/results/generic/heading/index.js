import useComponentEvents from "lib/hooks/use-component-events";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function GenericHeading() {
  const results = useResults({surveyType: "generic"});
  const translate = useTranslate();

  useComponentEvents("GenericHeading");

  if(!results) { return null; }

  const totalQuestions = results.responses.length;

  return (
    <div className={style.container}>
      <div className={style.title}>{translate("results.generic.score")}</div>
      <div className={style.scores}>
        <div className={style.correct}>
          <div>{translate("results.generic.correct")}:</div>
          <div>{results.totalCorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.incorrect}>
          <div>{translate("results.generic.incorrect")}:</div>
          <div>{results.totalIncorrectResponses} / {totalQuestions}</div>
        </div>
        <div className={style.overall}>
          <div>{translate("results.generic.overall_score")}:</div>
          <div>{results.overallScore}%</div>
        </div>
      </div>
    </div>
  );
}
