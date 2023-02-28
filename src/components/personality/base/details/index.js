import {useEffect, useState} from "react";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const detailTypes = [
  {apiKey: "Complement", disableKey: "PersonalityComplements", translationKey: "complements"},
  {apiKey: "Conflict", disableKey: "PersonalityConflicts", translationKey: "conflicts"},
  {apiKey: "Environments", disableKey: "PersonalityEnvironments", translationKey: "best_work_environments"}
];

export default function PersonalityBaseDetails() {
  const allowHeaders = useOption("allowHeaders");
  const disabled = useDisabledComponent("PersonalityDetails");
  const personality = usePersonality();
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const translate = useTranslate();
  const details = useInlineMemo((value) => value || [], [dig(personality, "details")]);
  const disabledComponents = useInlineMemo((value) => value || [], [useOption("disabledComponents")]);

  useComponentEvents("PersonalityBaseDetails", {activeType, personality, types});
  useEffect(() => {
    if(details.length === 0) { return; }

    const activeTypes = detailTypes
      .filter(({disableKey}) => !disabledComponents.includes(disableKey))
      .map((type) => {
        let data = details.filter(({title}) => (title === type.apiKey))
          .map(({body}) => body);

        if(data.length === 0) {
          data = (personality[type.apiKey.toLowerCase()] || [])
            .map(({name}) => name);
        }

        return {...type, data: data.length > 1 ? data : data[0]};
      }).filter(({data}) => data);

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details, personality]);

  if(disabled) { return null; }
  if(!personality) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => (
    setActiveType(types.find(({translationKey}) => translationKey === value))
  );

  return (
    <div className={style.container}>
      {allowHeaders && <div className={style.sectionHeading}>{translate("personality_details")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.translationKey}
            className={activeType.translationKey === type.translationKey ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            {translate(type.translationKey)}
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.translationKey}>
        {types.map(({translationKey: key}) => (
          <option key={key} value={key}>{translate(key)}</option>
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
