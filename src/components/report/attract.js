import {useMemo} from "react";
import BaseDetails from "components/results/personality/base/details";
import BaseHeading from "components/results/personality/base/heading";
import BaseStyles from "components/results/personality/base/styles";
import Traits from "components/results/personality/trait/list";
import Types from "components/results/personality/type/list";
import Redacted from "components/status/redacted";
import dig from "lib/common/object/dig";
import useRedacted from "lib/hooks/use-redacted";
import useReportDisabledComponents from "lib/hooks/use-report-disabled-components";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

export default function AttractReport() {
  const redacted = useRedacted();
  const results = useResults();
  const careerStyle = !!dig(results, "personality_types", 0, "personality_type", "career_style", 0);
  const disabled = useMemo(() => (careerStyle ? ["Results.Personality.Trait.List"] : []), [careerStyle]);

  useReportDisabledComponents(disabled);

  if(redacted) { return <Redacted />; }

  return (
    <section className={style.container}>
      <BaseHeading />
      <BaseStyles />
      <Types />
      <Traits />
      <BaseDetails />
    </section>
  );
}
