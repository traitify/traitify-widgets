import useAssessment from "lib/hooks/use-assessment";
import useComponentEvents from "lib/hooks/use-component-events";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function Results() {
  const assessment = useAssessment();
  const translate = useTranslate();

  useComponentEvents("Results", {assessment});

  if(!assessment?.completedAt) { return null; }

  return (
    <div className={style.container}>
      <div className={style.h1}>{translate("rjp.results.heading") || "You've successfully completed the preview!"}</div>
      <div className={style.p}>{translate("rjp.results.content") || "Thank you for completing the realistic job preview. I hope this gave you insight on what this job may be like."}</div>
    </div>
  );
}
