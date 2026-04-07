import GenericConclusions from "components/results/generic/conclusions";
import ArchetypeHeading from "components/results/personality/archetype/heading";
import ArchetypeSkills from "components/results/personality/archetype/skills";
import ArchetypeTips from "components/results/personality/archetype/tips";
import Dimensions from "components/results/personality/dimension/list";
import useActive from "lib/hooks/use-active";
import useDefaultOptions from "lib/hooks/use-default-options";
import style from "./style.scss";

export default function EmployeeReport() {
  const active = useActive();

  useDefaultOptions({applyAssessmentExpiration: true, perspective: "thirdPerson"});

  if(!active) { return null; }
  if(active.surveyType === "generic") {
    return (
      <section className={style.container}>
        <GenericConclusions />
      </section>
    );
  }

  return (
    <section className={style.container}>
      <ArchetypeHeading />
      <ArchetypeSkills />
      <ArchetypeTips />
      <Dimensions />
    </section>
  );
}
