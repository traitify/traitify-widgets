import Feedback from "components/results/feedback";
import GenericConclusions from "components/results/generic/conclusions";
import ArchetypeHeading from "components/results/personality/archetype/heading";
import ArchetypeTips from "components/results/personality/archetype/tips";
import Dimensions from "components/results/personality/dimension/list";
import Traits from "components/results/personality/trait/list";
import RJPResults from "components/results/rjp";
import Redacted from "components/status/redacted";
import useActive from "lib/hooks/use-active";
import useDefaultOptions from "lib/hooks/use-default-options";
import useRedacted from "lib/hooks/use-redacted";
import useReportDisabledComponents from "lib/hooks/use-report-disabled-components";
import style from "./style.scss";

const DISABLED_COMPONENTS = ["Results.Personality.Dimension.Details.Pitfalls"];

export default function CandidateReport() {
  const active = useActive();
  const redacted = useRedacted();

  useDefaultOptions({perspective: "firstPerson"});
  useReportDisabledComponents(DISABLED_COMPONENTS);

  if(!active) { return null; }
  if(redacted) { return <Redacted />; }
  if(active.surveyType === "external") { return null; }
  if(active.surveyType === "generic") {
    return (
      <section className={style.container}>
        <GenericConclusions />
      </section>
    );
  }
  if(active.surveyType === "rjp") {
    return (
      <section className={style.container}>
        <RJPResults />
      </section>
    );
  }

  return (
    <section className={style.container}>
      <ArchetypeHeading />
      <Feedback />
      <ArchetypeTips />
      <Dimensions />
      <Traits />
    </section>
  );
}
