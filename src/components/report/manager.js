import {useEffect} from "react";
import {useRecoilState} from "recoil";
import CognitiveChart from "components/results/cognitive/chart";
import GenericBreakdown from "components/results/generic/breakdown";
import GenericHeading from "components/results/generic/heading";
import ClientGuide from "components/results/guide/client";
import PersonalityGuide from "components/results/guide/personality";
import RecommendationChart from "components/results/recommendation/chart";
import RecommendationList from "components/results/recommendation/list";
import useActive from "lib/hooks/use-active";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function ManagerReport() {
  const active = useActive();
  const [options, setOptions] = useRecoilState(optionsState);
  const showHeaders = useOption("showHeaders");
  // NOTE: Temporary option until Paradox is ready
  const showRecommendationList = useOption("showRecommendationList");
  const translate = useTranslate();

  useEffect(() => {
    const newOptions = {};

    if(!Object.hasOwn(options, "applyAssessmentExpiration")) { newOptions.applyAssessmentExpiration = false; }
    if(!Object.hasOwn(options, "perspective")) { newOptions.perspective = "thirdPerson"; }
    if(Object.keys(newOptions).length === 0) { return; }

    setOptions((oldOptions) => ({...oldOptions, ...newOptions}));
  }, [options]);

  if(!active) { return null; }
  if(active.surveyType === "generic") {
    return (
      <section className={[style.container, style.box].join(" ")}>
        <GenericHeading />
        <GenericBreakdown />
      </section>
    );
  }

  return (
    <section>
      {showRecommendationList && <RecommendationList />}
      <ClientGuide />
      <div className={[style.container, style.box].join(" ")}>
        {showHeaders && (
          <>
            <div className={style.sectionHeading}>{translate("recommendation_chart_heading")}</div>
            <div className={style.p}>{translate("recommendation_chart_description")}</div>
          </>
        )}
        <RecommendationChart combined={true} />
        <PersonalityGuide combined={true} />
      </div>
      <CognitiveChart />
    </section>
  );
}
