import {useEffect} from "react";
import {useRecoilState} from "recoil";
import PersonalityArchetypeHeading from "components/personality/archetype/heading";
import PersonalityArchetypeSkills from "components/personality/archetype/skills";
import PersonalityArchetypeTips from "components/personality/archetype/tips";
import PersonalityDimensions from "components/personality/dimension/list";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function EmployeeReport() {
  const [options, setOptions] = useRecoilState(optionsState);

  useEffect(() => {
    if(options.perspective) { return; }

    setOptions({...options, perspective: "thirdPerson"});
  }, []);

  return (
    <section className={style.container}>
      <PersonalityArchetypeHeading />
      <PersonalityArchetypeSkills />
      <PersonalityArchetypeTips />
      <PersonalityDimensions />
    </section>
  );
}
