import useResults from "lib/hooks/use-results";
import Breakdown from "./breakdown";
import Score from "./score";
import style from "./style.scss";

export default function GenericResults() {
  const result = useResults({surveyType: "generic"});
  if(!result) { return null; }

  return (
    <div>
      <div className={style.container}>
        <div className={style.contentBody}>
          <Score assessmentResult={result} />
          <Breakdown assessmentResult={result} />
        </div>
      </div>
    </div>
  );
}
