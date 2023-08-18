import {useMemo} from "react";
import reverse from "lib/common/array/reverse";
import capitalize from "lib/common/string/capitalize";
import {combine} from "lib/common/combine-data";
import useComponentEvents from "lib/hooks/use-component-events";
import useGuide from "lib/hooks/use-guide";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const ranks = ["other", "low", "medium", "high"];

export default function PersonalityDimensionChart() {
  const guide = useGuide();
  const results = useResults({type: "personality"});
  const translate = useTranslate();
  const data = useMemo(() => (
    results && combine({guide, order: "types", types: results.personality_types})
  ), [guide, results]);

  useComponentEvents("PersonalityDimensionChart");

  if(!data) { return null; }

  return (
    <div className={style.container}>
      <div className={style.p}>{translate("dimension_description")}</div>
      <div className={style.horizontal}>
        {data.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.row, style[rank]].join(" ")} data-content={capitalize(rank)}>
            <div className={style.label}>
              {competency && <div>{competency.name}</div>}
              <div>{name}</div>
            </div>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </div>
        ))}
        <div className={style.scale}>
          {ranks.map((rank) => <div key={rank} />)}
        </div>
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {reverse(ranks).map((rank) => <div key={rank} />)}
        </div>
        {data.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.column, style[rank]].join(" ")} data-content={capitalize(rank)}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
            {competency && <div className={style.heading}>{competency.name}</div>}
            <div className={style.heading}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
