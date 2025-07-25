import {useState, useEffect} from "react";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useResults from "lib/hooks/use-results";
import Breakdown from "./breakdown";
import Header from "./header";
import ResultActions from "./result_actions";
import Score from "./score";
import style from "./style.scss";

export default function Generic() {
  const [result, setResult] = useState(null);
  const assessment = useResults({surveyType: "generic"});
  const profile = result ? result.profile : {};
  const assessmentResult = result ? result.assessment : {};

  const graphQL = useGraphql();
  const http = useHttp();

  useEffect(() => {
    if(assessment === null) return;
    const query = graphQL.generic.result;
    const variables = {assessmentID: assessment.id};

    http.post(graphQL.generic.path, {query, variables}).then(({data, errors}) => {
      if(!errors && data.genericAssessmentResult) {
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
          <Header profile={profile} assessment={assessmentResult} />
          <div className={style.contentBody}>
            <ResultActions />
            <Score assessmentResult={assessmentResult} />
            <Breakdown assessmentResult={assessmentResult} />
          </div>
        </div>
      )}
    </div>
  );
}
