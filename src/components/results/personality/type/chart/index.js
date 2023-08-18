import {useEffect, useState} from "react";
import reverse from "lib/common/array/reverse";
import getDetail from "lib/common/get-detail";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function PersonalityTypeChart() {
  const [activeType, setActiveType] = useState(null);
  const disabled = useDisabledComponent("PersonalityTypes");
  const perspective = useOption("perspective");
  const results = useResults({type: "personality"});
  const showHeaders = useOption("showHeaders");
  const [types, setTypes] = useState([]);
  const translate = useTranslate();

  useComponentEvents("PersonalityTypeChart");
  useEffect(() => {
    const data = (dig(results, "personality_types") || [])
      .map(({personality_type: type, score}) => ({...type, score}));

    setTypes(data);
    setActiveType(data[0]);
  }, [results]);

  if(disabled) { return null; }
  if(!activeType) { return null; }

  const max = Math.max(...types.map(({score}) => score)) > 10 ? 100 : 10;
  const scale = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const showType = (newID) => setActiveType(types.find(({id}) => newID === id));
  const onChange = ({target: {value}}) => showType(value);

  let description = getDetail({
    name: "description",
    personality: activeType,
    perspective
  });
  let title = activeType.name;

  if(description.startsWith("'")) {
    title = description.split("'")[1];
    description = description.split("'").splice(2).join("'");

    if(description.startsWith("...")) { description = description.slice(3).trim(); }
  }

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("personality_breakdown")}</div>}
      <div className={style.horizontal}>
        {types.map(({badge, id, name, score: _score}, index) => {
          const score = index === 0 ? 95 : _score;
          const percent = score / (max * 0.01);
          const inlineStyle = {backgroundColor: `#${badge.color_1}`, width: `${percent}%`};
          const tooBig = score > max * 0.75;

          return (
            <div key={id} className={style.row}>
              <div className={style.label}>
                <div>{name}</div>
                <img alt={`${name} ${translate("badge")}`} src={badge.image_medium} />
              </div>
              <div className={style.grid}>
                <div className={style.bar} style={inlineStyle} />
                <div className={[style.score, tooBig && style.tooBig].filter(Boolean).join(" ")}>{max === 100 ? `${Math.round(score)}%` : score}</div>
              </div>
            </div>
          );
        })}
        <div className={style.scale}>
          {scale.map((rank) => <div key={rank} />)}
        </div>
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {reverse(scale).map((rank) => <div key={rank}>{rank}</div>)}
        </div>
        {types.map(({badge, id, score}) => {
          const percent = score / (max * 0.01);
          const inlineStyle = {backgroundColor: `#${badge.color_1}`, height: `${percent}%`};

          return (
            <div key={id} className={style.column}>
              <div className={style.bar}>
                <div className={style.score} style={inlineStyle} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={style.tabs}>
        {types.map(({badge, id, name}) => (
          <button
            key={id}
            className={[id === activeType.id && style.active].filter(Boolean).join(" ")}
            onClick={() => showType(id)}
            type="button"
          >
            <span>
              <img alt={`${name} ${translate("badge")}`} src={badge.image_medium} />
              {name}
            </span>
          </button>
        ))}
      </div>
      <div className={style.content}>
        <select className={style.dropdown} onChange={onChange} value={activeType.id}>
          {types.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        <div className={style.heading}>{title}</div>
        <div className={style.p}>{description}</div>
      </div>
    </div>
  );
}
