import CognitiveChart from "components/results/cognitive/chart";
import ExternalResults from "components/results/external";
import GenericBreakdown from "components/results/generic/breakdown";
import GenericHeading from "components/results/generic/heading";
import ClientGuide from "components/results/guide/client";
import PersonalityGuide from "components/results/guide/personality";
import RecommendationChart from "components/results/recommendation/chart";
import RecommendationList from "components/results/recommendation/list";
import RJPResults from "components/results/rjp";
import Redacted from "components/status/redacted";
import useActive from "lib/hooks/use-active";
import useDefaultOptions from "lib/hooks/use-default-options";
import useOption from "lib/hooks/use-option";
import useRedacted from "lib/hooks/use-redacted";
import useReportDisabledComponents from "lib/hooks/use-report-disabled-components";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const DISABLED_COMPONENTS = [];

export default function ManagerReport() {
  const active = useActive();
  const redacted = useRedacted();
  const showHeaders = useOption("showHeaders");
  // NOTE: Temporary option until Paradox is ready
  const showRecommendationList = useOption("showRecommendationList");
  const translate = useTranslate();

  useDefaultOptions({applyAssessmentExpiration: true, perspective: "thirdPerson"});
  useReportDisabledComponents(DISABLED_COMPONENTS);

  if(!active) { return null; }
  if(redacted) { return <Redacted />; }
  if(active.surveyType === "external") { return <ExternalResults />; }
  if(active.surveyType === "generic") {
    return (
      <section className={[style.container, style.box].join(" ")}>
        <GenericHeading />
        <GenericBreakdown />
      </section>
    );
  }
  if(active.surveyType === "rjp") {
    return (
      <section className={[style.container, style.box].join(" ")}>
        <RJPResults />
      </section>
    );
  }

  return (
    <section>
      {showRecommendationList && <RecommendationList />}
      <div className={[style.container, style.box].join(" ")}>
        {!showRecommendationList && showHeaders && (
          <>
            <div className={style.sectionHeading}>{translate("results.benchmarks.chart.heading")}</div>
            <div className={style.p}>{translate("results.benchmarks.chart.description")}</div>
          </>
        )}
        <RecommendationChart combined={true} />
        <PersonalityGuide combined={true} />
      </div>
      <ClientGuide />
      <CognitiveChart />
      <ExternalResults />
    </section>
  );
}
