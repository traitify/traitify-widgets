import useAssessment from "lib/hooks/use-assessment";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function RJP() {
  const assessment = useAssessment({surveyType: "rjp"});
  const disabled = useDisabledComponent("Results.RJP");
  const translate = useTranslate();

  const context = {assessment};
  useComponentEvents("Results", context);
  useComponentEvents({component: "Results.RJP", context});

  if(disabled) { return null; }
  if(!assessment?.completedAt) { return null; }

  return (
    <div className={style.container}>
      <div className={style.h1}>{translate("results.rjp.heading")}</div>
      <div className={style.p}>{translate("results.rjp.content")}</div>
    </div>
  );
}
