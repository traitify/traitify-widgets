import {useState, useEffect} from "react";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

export default function Generic() {
  const [result, setResult] = useState(null);
  const assessment = useResults({surveyType: "generic"});
  const profile = result ? result.profile : {};

  const graphQL = useGraphql();
  const http = useHttp();

  useEffect(() => {
    if(assessment === null) return;
    const query = graphQL.generic.result;
    const variables = {assessmentID: assessment.id};

    http.post(graphQL.generic.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.genericAssessmentResult) {
        console.log("Generic assessment result data:", data.genericAssessmentResult);
        setResult(data.genericAssessmentResult);
      } else {
        console.warn(errors || data); // eslint-disable-line no-console
      }
    });
  }, [assessment]);

  return (
    <div>
      {result && (
        <div className={style.container}>
          {profile.firstName} {profile.lastName}
          <p>Completed on: {assessment ? assessment.completedAt : ""}</p>
          <hr />
          <div>
            <h4>Assessment Results</h4>
          </div>
          <div className={style.score}>
            <h4>Score</h4>
            <div className={style.scoreRow}>
              <div className={style.correct}>
                <div>Correct:</div>
                <div className={style.count}>16 / 20</div>
              </div>
              <div className={style.incorrect}>
                <div>Incorrect:</div>
                <div className={style.count}>4 / 20</div>
              </div>
              <div className={style.overall}>
                <div>Overall Score:</div>
                <div className={style.count}>80%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
