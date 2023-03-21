import {useEffect} from "react";
import {useRecoilState} from "recoil";
import Guide from "components/personality/guide";
import PersonalityRecommendationChart from "components/personality/recommendation/chart";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function ManagerReport() {
  const [options, setOptions] = useRecoilState(optionsState);
  const showHeaders = useOption("showHeaders");
  const translate = useTranslate();

  useEffect(() => {
    if(options.perspective) { return; }

    setOptions({...options, perspective: "thirdPerson"});
  }, []);

  return (
    <section className={[style.container, style.box].join(" ")}>
      {showHeaders && (
        <>
          <div className={style.sectionHeading}>{translate("recommendation_chart_heading")}</div>
          <div className={style.p}>{translate("recommendation_chart_description")}</div>
        </>
      )}
      <PersonalityRecommendationChart combined={true} />
      <Guide combined={true} />
    </section>
  );
}
