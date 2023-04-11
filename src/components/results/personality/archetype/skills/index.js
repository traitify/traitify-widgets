import {useEffect, useState} from "react";
import sortByTypePosition from "lib/common/sort-by-type-position";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const skillTypes = [
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/stress-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/stress-default.png"
    },
    key: "dealing_with_stress",
    name: "Dealing With Stress"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/leading-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/leading-default.png"
    },
    key: "leading_others",
    name: "Leading Others"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/chat-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/chat-default.png"
    },
    key: "communication",
    name: "Communication"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/teamwork-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/teamwork-default.png"
    },
    key: "teamwork",
    name: "Teamwork"
  },
  {
    image: {
      active: "https://cdn.traitify.com/widgets/skills/build-blue.png",
      default: "https://cdn.traitify.com/widgets/skills/build-default.png"
    },
    key: "habits",
    name: "Habits To Build"
  }
];

export default function PersonalityArchetypeSkills() {
  const disabled = useDisabledComponent("PersonalitySkills");
  const results = useResults();
  const showHeaders = useOption("showHeaders");
  const [activeType, setActiveType] = useState(null);
  const [types, setTypes] = useState([]);
  const translate = useTranslate();
  const details = useInlineMemo((value) => value || [], [dig(results, "archetype", "details")]);
  const disabledComponents = useInlineMemo((value) => value || [], [useOption("disabledComponents")]);

  useComponentEvents("PersonalitySkills", {activeType, types});
  useEffect(() => {
    if(details.length === 0) { return; }

    const activeTypes = skillTypes.filter((type) => {
      if(disabledComponents.includes(type.name)) { return false; }

      return details.find(({title}) => title.startsWith(`${type.name} - Success Skills`));
    });

    setTypes(activeTypes);
    setActiveType(activeTypes[0]);
  }, [details, disabledComponents]);

  if(disabled) { return null; }
  if(!results) { return null; }
  if(!activeType) { return null; }

  const onChange = ({target: {value}}) => setActiveType(types.find((type) => type.key === value));
  const typeTips = details
    .filter(({title}) => title.startsWith(`${activeType.name} - Success Skills`));
  const tips = [];

  sortByTypePosition(results.personality_types).forEach(({personality_type: {name}}) => {
    const tip = typeTips.find(({title}) => title.endsWith(name));
    if(tip) { tips.push(tip.body); }
  });

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("success_skills")}</div>}
      <div className={style.tabs}>
        {types.map((type) => (
          <button
            key={type.key}
            className={activeType.key === type.key ? style.active : ""}
            onClick={() => setActiveType(type)}
            type="button"
          >
            <img
              alt={translate(`skill_name_for_${type.key}`)}
              className={style.image}
              src={type.image[activeType.key === type.key ? "active" : "default"]}
            />
            <div>{translate(`skill_name_for_${type.key}`)}</div>
          </button>
        ))}
      </div>
      <select className={style.dropdown} onChange={onChange} value={activeType.key}>
        {types.map(({key}) => (
          <option key={key} value={key}>{translate(`skill_name_for_${key}`)}</option>
        ))}
      </select>
      <div className={style.content}>
        <div className={style.heading}>{translate(`skill_heading_for_${activeType.key}`)}</div>
        {tips.map((tip) => <div key={tip} className={style.tip}>{tip}</div>)}
      </div>
    </div>
  );
}
