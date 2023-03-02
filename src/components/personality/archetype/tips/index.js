import {useEffect, useState} from "react";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const tipTypes = {
  firstPerson: [
    {apiKey: "Tools to Use", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Caution Zone", disableKey: "PersonalityCaution", translationKey: "room"},
    {apiKey: "Settings that Work for You", disableKey: "PersonalitySettings", translationKey: "settings"}
  ],
  thirdPerson: [
    {apiKey: "Third Person Tools to Use", disableKey: "PersonalityTools", translationKey: "tools"},
    {apiKey: "Third Person Caution Zone", disableKey: "PersonalityCaution", translationKey: "caution_zone"},
    {apiKey: "Third Person Settings that Work for Them", disableKey: "PersonalitySettings", translationKey: "settings_third_person"}
  ]
};

export default function PersonalityArchetypeTips() {
  const disabled = useDisabledComponent("PersonalityTips");
  const perspective = useInlineMemo((value) => value || "firstPerson", [useOption("perspective")]);
  const results = useResults();
  const showHeaders = useOption("showHeaders");
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const translate = useTranslate();
  const details = useInlineMemo((value) => value || [], [dig(results, "archetype", "details")]);
  const disabledComponents = useInlineMemo((value) => value || [], [useOption("disabledComponents")]);

  useComponentEvents("PersonalityTips", {activeType, types});
  useEffect(() => {
    if(details.length === 0) { return; }

    const filter = (type) => {
      if(disabledComponents.includes(type.disableKey)) { return false; }

      return details.find(({title}) => (title === type.apiKey));
    };
    let activeTypes = tipTypes[perspective].filter(filter);
    if(activeTypes.length === 0 && perspective === "thirdPerson") {
      activeTypes = tipTypes.firstPerson.filter(filter);
    }

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details, perspective]);

  if(disabled) { return null; }
  if(!results) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );
  const tips = details.filter(({title}) => (title === activeType.apiKey)).map(({body}) => body);

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("personality_tips")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(`tip_type_for_${type.translationKey}`)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(`tip_type_for_${key}`)}</option>
        ))}
      </select>
      <div className={style.content}>
        {tips.map((tip) => <div key={tip}>{tip}</div>)}
      </div>
    </div>
  );
}
