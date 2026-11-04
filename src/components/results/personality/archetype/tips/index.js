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
    {apiKey: "Tools to Use", name: "tools", translationKey: "tools"},
    {apiKey: "Caution Zone", name: "caution", translationKey: "room"},
    {apiKey: "Settings that Work for You", name: "settings", translationKey: "settings"}
  ],
  thirdPerson: [
    {apiKey: "Third Person Tools to Use", name: "tools", translationKey: "tools"},
    {apiKey: "Third Person Caution Zone", name: "caution", translationKey: "caution_zone"},
    {
      apiKey: "Third Person Settings that Work for Them",
      name: "settings",
      translationKey: "settings_third_person"
    }
  ]
};

export default function PersonalityArchetypeTips() {
  const disabled = useDisabledComponent("Results.Personality.Archetype.Tips", "PersonalityTips");
  const cautionDisabled = useDisabledComponent(
    "Results.Personality.Archetype.Tips.Caution",
    "PersonalityCaution"
  );
  const settingsDisabled = useDisabledComponent(
    "Results.Personality.Archetype.Tips.Settings",
    "PersonalitySettings"
  );
  const toolsDisabled = useDisabledComponent(
    "Results.Personality.Archetype.Tips.Tools",
    "PersonalityTools"
  );
  const perspective = useInlineMemo((value) => value || "firstPerson", [useOption("perspective")]);
  const results = useResults({surveyType: "personality"});
  const showHeaders = useOption("showHeaders");
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const translate = useTranslate();
  const details = useInlineMemo((value) => value || [], [dig(results, "archetype", "details")]);

  const context = {activeType, types};
  useComponentEvents("PersonalityTips", context);
  useComponentEvents({component: "Results.Personality.Archetype.Tips", context});
  useEffect(() => {
    if(details.length === 0) { return; }

    const disabledTips = {
      caution: cautionDisabled,
      settings: settingsDisabled,
      tools: toolsDisabled
    };
    const filter = (type) => {
      if(disabledTips[type.name]) { return false; }

      return details.find(({title}) => (title === type.apiKey));
    };
    let activeTypes = tipTypes[perspective].filter(filter);
    if(activeTypes.length === 0 && perspective === "thirdPerson") {
      activeTypes = tipTypes.firstPerson.filter(filter);
    }

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [cautionDisabled, details, perspective, settingsDisabled, toolsDisabled]);

  if(disabled) { return null; }
  if(!results) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );
  const tips = details.filter(({title}) => (title === activeType.apiKey)).map(({body}) => body);

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("results.personality.tips.heading")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(`results.personality.tips.${type.translationKey}`)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(`results.personality.tips.${key}`)}</option>
        ))}
      </select>
      <div className={style.content}>
        {tips.map((tip) => <div key={tip}>{tip}</div>)}
      </div>
    </div>
  );
}
