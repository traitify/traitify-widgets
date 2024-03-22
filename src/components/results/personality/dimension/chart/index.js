import reverse from "lib/common/array/reverse";
import useComponentEvents from "lib/hooks/use-component-events";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";
import useData from "./use-data";

export default function PersonalityDimensionChart() {
  const data = useData();
  const translate = useTranslate();

  useComponentEvents("PersonalityDimensionChart");

  if(!data) { return null; }

  return (
    <div className={style.container}>
      <div className={style.p}>{translate("dimension_description")}</div>
      <div className={style.horizontal}>
        {data.columns.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.row, style[rank.value]].join(" ")} data-content={rank.name}>
            <div className={style.label}>
              {competency && <div>{competency.name}</div>}
              <div>{name}</div>
            </div>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </div>
        ))}
        <div className={style.scale}>
          {data.ranks.map(({value}) => <div key={value} />)}
        </div>
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {reverse(data.ranks).map(({value}) => <div key={value} />)}
        </div>
        {data.columns.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.column, style[rank.value]].join(" ")} data-content={rank.name}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
            {competency && <div className={style.heading}>{competency.name}</div>}
            <div className={style.heading}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
