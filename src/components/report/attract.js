import {useEffect} from "react";
import {useRecoilState} from "recoil";
import BaseDetails from "components/results/personality/base/details";
import BaseHeading from "components/results/personality/base/heading";
import BaseStyles from "components/results/personality/base/styles";
import Traits from "components/results/personality/trait/list";
import Types from "components/results/personality/type/list";
import dig from "lib/common/object/dig";
import useResults from "lib/hooks/use-results";
import {optionsState} from "lib/recoil";
import style from "./style.scss";

export default function AttractReport() {
  const results = useResults();
  const [options, setOptions] = useRecoilState(optionsState);

  useEffect(() => {
    if(!results) { return; }

    const newContent = dig(results, "personality_types", 0, "personality_type", "career_style", 0);
    if(!newContent) { return; }

    const disabledComponents = options.disabledComponents || [];
    const newOptions = {};

    if(!disabledComponents.includes("PersonalityBaseDetails")) {
      newOptions.disabledComponents = [...disabledComponents, "PersonalityBaseDetails"];
    }
    if(!disabledComponents.includes("PersonalityTraits") && !options.showTraitList) {
      if(!newOptions.disabledComponents) {
        newOptions.disabledComponents = [...disabledComponents];
      }
      newOptions.disabledComponents = [...newOptions.disabledComponents, "PersonalityTraits"];
    }
    if(Object.keys(newOptions).length === 0) { return; }

    setOptions({...options, ...newOptions});
  }, [results]);

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
