import {useEffect} from "react";
import {useRecoilState} from "recoil";
import ArchetypeHeading from "components/results/personality/archetype/heading";
import ArchetypeSkills from "components/results/personality/archetype/skills";
import ArchetypeTips from "components/results/personality/archetype/tips";
import Dimensions from "components/results/personality/dimension/list";
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
      <ArchetypeHeading />
      <ArchetypeSkills />
      <ArchetypeTips />
      <Dimensions />
    </section>
  );
}
