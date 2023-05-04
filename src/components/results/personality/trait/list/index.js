import {useState} from "react";
import PersonalityTrait from "components/results/personality/trait/details";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function PersonalityTraitList() {
  const disabled = useDisabledComponent("PersonalityTraits");
  const showHeaders = useOption("showHeaders");
  const results = useResults();
  const translate = useTranslate();
  const [showMore, setShowMore] = useState(false);

  useComponentEvents("PersonalityTraits");

  if(disabled) { return null; }
  if(!results) { return null; }

  const text = translate(showMore ? "show_less" : "show_more");
  let traits = results.personality_traits;

  if(!showMore) { traits = traits.slice(0, 5); }

  return (
    <div className={style.container}>
      {showHeaders && (
        <>
          <div className={style.sectionHeading}>{translate("personality_traits")}</div>
          <div className={style.p}>{translate("personality_traits_description")}</div>
        </>
      )}
      {traits.map((trait) => (
        <PersonalityTrait key={trait.personality_trait.id} trait={trait} />
      ))}
      <div className={style.center}>
        <button className={style.toggle} onClick={() => setShowMore(!showMore)} type="button">{text}</button>
      </div>
    </div>
  );
}
