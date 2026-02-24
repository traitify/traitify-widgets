import Markdown from "components/common/markdown";
import useComponentEvents from "lib/hooks/use-component-events";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

export default function GenericConclusions() {
  const results = useResults({surveyType: "generic"});

  useComponentEvents("GenericConclusions");

  if(!results) { return null; }

  return (
    <div className={style.container}>
      <Markdown>{results.survey.conclusions}</Markdown>
    </div>
  );
}
