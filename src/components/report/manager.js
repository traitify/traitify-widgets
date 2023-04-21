import {useEffect} from "react";
import {useRecoilState} from "recoil";
import PersonalityGuide from "components/results/guide/personality";
import RecommendationChart from "components/results/recommendation/chart";
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
      <RecommendationChart combined={true} />
      <PersonalityGuide combined={true} />
    </section>
  );
}
