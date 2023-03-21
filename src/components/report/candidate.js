import {useEffect} from "react";
import {useRecoilState} from "recoil";
import PersonalityArchetypeHeading from "components/personality/archetype/heading";
import PersonalityArchetypeTips from "components/personality/archetype/tips";
import PersonalityDimensions from "components/personality/dimension/list";
import PersonalityTraits from "components/personality/trait/list";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function CandidateReport() {
  const [options, setOptions] = useRecoilState(optionsState);

  useEffect(() => {
    const disabledComponents = options.disabledComponents || [];
    const newOptions = {};

    if(!disabledComponents.includes("PersonalityPitfalls")) {
      newOptions.disabledComponents = [...disabledComponents, "PersonalityPitfalls"];
    }
    if(!options.perspective) { newOptions.perspective = "firstPerson"; }
    if(Object.keys(newOptions).length === 0) { return; }

    setOptions({...options, newOptions});
  }, []);

  return (
    <section className={style.container}>
      <PersonalityArchetypeHeading />
      <PersonalityArchetypeTips />
      <PersonalityDimensions />
      <PersonalityTraits />
    </section>
  );
}
