import {useEffect} from "react";
import {useRecoilState} from "recoil";
import Feedback from "components/results/feedback";
import GenericConclusions from "components/results/generic/conclusions";
import ArchetypeHeading from "components/results/personality/archetype/heading";
import ArchetypeTips from "components/results/personality/archetype/tips";
import Dimensions from "components/results/personality/dimension/list";
import Traits from "components/results/personality/trait/list";
import useActive from "lib/hooks/use-active";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function CandidateReport() {
  const active = useActive();
  const [options, setOptions] = useRecoilState(optionsState);

  useEffect(() => {
    const disabledComponents = options.disabledComponents || [];
    const newOptions = {};

    if(!disabledComponents.includes("PersonalityPitfalls")) {
      newOptions.disabledComponents = [...disabledComponents, "PersonalityPitfalls"];
    }
    if(!options.perspective) { newOptions.perspective = "firstPerson"; }
    if(Object.keys(newOptions).length === 0) { return; }

    setOptions({...options, ...newOptions});
  }, []);

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
      <Feedback />
      <ArchetypeTips />
      <Dimensions />
      <Traits />
    </section>
  );
}
