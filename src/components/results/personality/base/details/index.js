import {useEffect, useState} from "react";
import getDetails from "lib/common/get-details";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const detailTypes = [
  {
    apiKey: "Complement",
    disableKeys: ["Results.Personality.Base.Details.Complements", "PersonalityComplements"],
    translationKey: "complements"
  },
  {
    apiKey: "Conflict",
    disableKeys: ["Results.Personality.Base.Details.Conflicts", "PersonalityConflicts"],
    translationKey: "conflicts"
  },
  {
    apiKey: "Environments",
    disableKeys: ["Results.Personality.Base.Details.Environments", "PersonalityEnvironments"],
    translationKey: "best_work_environments"
  }
];

export default function PersonalityBaseDetails() {
  const disabled = useDisabledComponent("Results.Personality.Base.Details", "PersonalityDetails");
  const personality = usePersonality();
  const showHeaders = useOption("showHeaders");
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const translate = useTranslate();
  const disabledComponents = useInlineMemo((value) => value || [], [useOption("disabledComponents")]);

  const context = {activeType, personality, types};
  useComponentEvents("PersonalityBaseDetails", context);
  useComponentEvents({component: "Results.Personality.Base.Details", context});
  useEffect(() => {
    const details = dig(personality, "details") || [];
    if(details.length === 0) { return; }

    const activeTypes = detailTypes
      .filter(({disableKeys}) => !disableKeys.some((key) => disabledComponents.includes(key)))
      .map((type) => {
        const data = getDetails({name: type.apiKey, personality});

        return {...type, data: data.length > 1 ? data : data[0]};
      }).filter(({data}) => data);

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [personality]);

  if(disabled) { return null; }
  if(!personality) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("results.personality.details.heading")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(`results.personality.details.${type.translationKey}`)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(`results.personality.details.${key}`)}</option>
        ))}
      </select>
      <div>
        {Array.isArray(activeType.data) ? (
          <ul>
            {activeType.data.map((data) => <li key={data}>{data}</li>)}
          </ul>
        ) : (
          <div className="p">{activeType.data}</div>
        )}
      </div>
    </div>
  );
}
