import times from "lib/common/array/times";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useSetting from "lib/hooks/use-setting";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function CognitiveChart() {
  const disabled = useDisabledComponent("CognitiveChart");
  const results = useResults({surveyType: "cognitive"});
  const allowed = useSetting("showCognitiveResults", {fallback: false});
  const showHeaders = useOption("showHeaders");
  const translate = useTranslate();

  useComponentEvents("CognitiveChart");

  if(!allowed) { return null; }
  if(disabled) { return null; }
  if(!results) { return null; }
  if(!results.stenScore) { return null; }

  const data = times(10).map((index) => index + 1).map((index) => ({
    active: index === results.stenScore,
    label: index,
    rank: index > 4 ? "high" : "low"
  }));

  return (
    <div className={style.container}>
      {showHeaders && (
        <div className={style.sectionHeading}>{translate("results.cognitive.breakdown.heading")}</div>
      )}
      <div className={style.p}>{translate("results.cognitive.breakdown.description", {survey_name: results.name})}</div>
      <div className={style.chart}>
        <div className={style.grid}>
          <div className={style.row}>
            {data.map(({active, label, rank}) => (
              <div
                key={label}
                className={[active && style.active, style[rank]].filter(Boolean).join(" ")}
              />
            ))}
          </div>
        </div>
        <div className={style.scale}>
          {data.map(({label}) => <div key={label}>{label}</div>)}
        </div>
      </div>
    </div>
  );
}
