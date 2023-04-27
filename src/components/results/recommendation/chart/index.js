import PropTypes from "prop-types";
import {useMemo} from "react";
import reverse from "lib/common/array/reverse";
import times from "lib/common/array/times";
import {createColumns} from "lib/common/combine-data";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useBenchmark from "lib/hooks/use-benchmark";
import useGuide from "lib/hooks/use-guide";
import useResults from "lib/hooks/use-results";
import useSetting from "lib/hooks/use-setting";
import style from "./style.scss";

const colors = {high: "#29B770", low: "#EF615E", medium: "#FFCC3B", other: "black"};

function RecommendationChart({combined}) {
  const benchmark = useBenchmark();
  const disabled = useDisabledComponent("RecommendationChart");
  const guide = useGuide();
  const results = useResults();
  const allowed = useSetting("showFitBreakdownGraph", {fallback: true});
  const data = useMemo(() => {
    const competencies = dig(guide, "personality", "competencies") || [];
    const types = dig(results, "personality_types") || [];
    if(competencies.length === 0 || types.length === 0) { return []; }

    return createColumns({benchmark, guide, order: "types", types});
  }, [benchmark, guide, results]);

  useComponentEvents("RecommendationChart");

  if(!allowed) { return null; }
  if(disabled) { return null; }
  if(data.length === 0) { return null; }

  const length = Math.max(...data.map(({data: points}) => points.length));
  const colorFromRank = (rank) => {
    if(rank === "low") { return benchmark ? benchmark.hexColorLow : colors.low; }
    if(rank === "medium") { return benchmark ? benchmark.hexColorMedium : colors.medium; }
    if(rank === "high") { return benchmark ? benchmark.hexColorHigh : colors.high; }

    return colors.other;
  };

  let ranks = dig(benchmark, "resultRankings") || [];
  ranks = [...ranks].sort((a, b) => ((a.maxScore < b.maxScore) ? 1 : -1));

  return (
    <div className={[style.container, combined && style.combined].filter(Boolean).join(" ")}>
      <div className={style.ranks}>
        {ranks.map(({description, visualHex, id}) => (
          <div key={id} className={style.chartLegendContainer}>
            <div className={style.chartLegendColor} style={{background: visualHex}} />
            <div>{description}</div>
          </div>
        ))}
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {times(length).map((index) => (
            <div key={index} className={style.label}>
              <span>{length - index}</span>
            </div>
          ))}
        </div>
        {data.map(({competency, data: points, type}) => (
          <div key={type.id} className={style.column}>
            {reverse(points).map(({active, rank}, index) => (
              <div
                key={index} /* eslint-disable-line react/no-array-index-key */
                className={[active && style.active, style[rank]].filter(Boolean).join(" ")}
                style={{background: colorFromRank(rank)}}
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
                {points.map(({active, rank}, index) => (
                  <div
                    key={index} /* eslint-disable-line react/no-array-index-key */
                    className={[active && style.active, style[rank]].filter(Boolean).join(" ")}
                    style={{background: colorFromRank(rank)}}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className={style.scale}>
            {times(length).map((index) => <div key={index}>{index + 1}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

RecommendationChart.defaultProps = {combined: false};
RecommendationChart.propTypes = {combined: PropTypes.bool};

export default RecommendationChart;
