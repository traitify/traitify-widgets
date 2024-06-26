import PropTypes from "prop-types";
import {useMemo} from "react";
import reverse from "lib/common/array/reverse";
import times from "lib/common/array/times";
import {createColumns, ranksFromBenchmark} from "lib/common/combine-data";
import dig from "lib/common/object/dig";
import useBenchmark from "lib/hooks/use-benchmark";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useGuide from "lib/hooks/use-guide";
import useResults from "lib/hooks/use-results";
import useSetting from "lib/hooks/use-setting";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function RecommendationChart({combined = false}) {
  const benchmark = useBenchmark();
  const disabled = useDisabledComponent("RecommendationChart");
  const guide = useGuide();
  const results = useResults({type: "personality"});
  const allowed = useSetting("showFitBreakdownGraph", {fallback: true});
  const data = useMemo(() => {
    const competencies = dig(guide, "personality", "competencies") || [];
    const types = dig(results, "personality_types") || [];
    if(competencies.length === 0 || types.length === 0) { return []; }

    return createColumns({benchmark, guide, order: "types", types});
  }, [benchmark, guide, results]);
  const ranks = useMemo(() => ranksFromBenchmark(benchmark), [benchmark]);
  const translate = useTranslate();

  useComponentEvents("RecommendationChart");

  if(!allowed) { return null; }
  if(disabled) { return null; }
  if(data.length === 0) { return null; }

  const scaleLength = Math.max(...data.map(({data: points}) => points.length));

  return (
    <div className={[style.container, combined && style.combined].filter(Boolean).join(" ")}>
      <div className={style.ranks}>
        {ranks.map(({color, label, rank}) => (
          <div key={rank} className={style.chartLegendContainer}>
            <div className={style.chartLegendColor} style={{background: color}} />
            <div>{label || translate(`level.${rank}`)}</div>
          </div>
        ))}
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {times(scaleLength).map((index) => (
            <div key={index} className={style.label}>
              <span>{scaleLength - index}</span>
            </div>
          ))}
        </div>
        {data.map(({competency, data: points, type}) => (
          <div key={type.id} className={style.column}>
            {reverse(points).map(({active, color, rank}, index) => (
              <div
                key={index} /* eslint-disable-line react/no-array-index-key */
                className={[active && style.active, style[rank]].filter(Boolean).join(" ")}
                style={{background: color}}
              />
            ))}
            <div className={style.name}>{competency.name}</div>
          </div>
        ))}
      </div>
      <div className={style.horizontal}>
        <div className={style.labels}>
          {data.map(({competency, type}) => <div key={type.id}>{competency.name}</div>)}
        </div>
        <div className={style.chart}>
          <div className={style.grid}>
            {data.map(({data: points, type}) => (
              <div key={type.id} className={style.row}>
                {points.map(({active, color, rank}, index) => (
                  <div
                    key={index} /* eslint-disable-line react/no-array-index-key */
                    className={[active && style.active, style[rank]].filter(Boolean).join(" ")}
                    style={{background: color}}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className={style.scale}>
            {times(scaleLength).map((index) => <div key={index}>{index + 1}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

RecommendationChart.propTypes = {combined: PropTypes.bool};

export default RecommendationChart;
