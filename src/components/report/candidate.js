import {useEffect} from "react";
import {useRecoilState} from "recoil";
import Feedback from "components/results/feedback";
import ArchetypeHeading from "components/results/personality/archetype/heading";
import ArchetypeTips from "components/results/personality/archetype/tips";
import Dimensions from "components/results/personality/dimension/list";
import Traits from "components/results/personality/trait/list";
import useAssessment from "lib/hooks/use-assessment";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function CandidateReport() {
  const [options, setOptions] = useRecoilState(optionsState);
  const assessment = useAssessment();

  const showFeedback = assessment?.deck_id === "big-five";

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
      <ArchetypeHeading />
      {showFeedback && <Feedback />}
      <ArchetypeTips />
      <Dimensions />
      <Traits />
    </section>
  );
}
