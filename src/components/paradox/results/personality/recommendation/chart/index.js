import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {reverse, times} from "lib/helpers/array";
import {createColumns} from "lib/helpers/combine-data";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

// const ranks = [
//   {key: "preferred", rank: "high"},
//   {key: "acceptable", rank: "medium"},
//   {key: "potential_risk", rank: "low"}
// ];
const colors = {high: "#29B770", low: "#EF615E", medium: "#FFCC3B", other: "black"};

function PersonalityRecommendationChart({setElement, ...props}) {
  const {
    assessment,
    benchmark,
    combined,
    followBenchmark,
    followGuide,
    getOption,
    guide,
    isReady,
    // translate,
    ui
  } = props;
  const [data, setData] = useState([]);
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityRecommendationChart.initialized", {props, state}); });
  useDidMount(() => { followBenchmark(); });
  useDidMount(() => { followGuide(); });
  useDidUpdate(() => { ui.trigger("PersonalityRecommendationChart.updated", {props, state}); });
  useEffect(() => {
    const competencies = dig(guide, "competencies") || [];
    const types = dig(assessment, "personality_types") || [];
    if(competencies.length === 0 || types.length === 0) { return; }

    setData(createColumns({benchmark, guide, order: "types", types}));
  }, [
    dig(assessment, "personality_types", 0, "personality_type", "name"),
    dig(benchmark, "id"),
    dig(benchmark, "rankings", 0, "description"),
    dig(guide, "assessment_id"),
    dig(guide, "locale_key")
  ]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("PersonalityRecommendationChart")) { return null; }
  if(!isReady("guide")) { return null; }
  if(!isReady("results")) { return null; }
  if(data.length === 0) { return null; }

  const length = Math.max(...data.map(({data: points}) => points.length));

  const colorFromRank = (rank) => {
    if(rank === "low") { return benchmark ? benchmark.hexColorLow : colors.low; }
    if(rank === "medium") { return benchmark ? benchmark.hexColorMedium : colors.medium; }
    if(rank === "high") { return benchmark ? benchmark.hexColorHigh : colors.high; }

    return colors.other;
  };

  return (
    <div className={[style.container, combined && style.combined].filter(Boolean).join(" ")} ref={setElement}>
      {/* <div className={style.ranks}>
        {ranks.map(({key, rank}) => <div key={key} className={style[rank]}>{translate(key)}</div>)}
      </div> */}
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

PersonalityRecommendationChart.defaultProps = {
  assessment: null,
  benchmark: null,
  combined: false,
  guide: null
};
PersonalityRecommendationChart.propTypes = {
  assessment: PropTypes.shape({
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          name: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    )
  }),
  benchmark: PropTypes.shape({
    id: PropTypes.string,
    hexColorLow: PropTypes.string.isRequired,
    hexColorMedium: PropTypes.string.isRequired,
    hexColorHigh: PropTypes.string.isRequired,
    dimensionRanges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        dimensionId: PropTypes.string.isRequired,
        matchScore: PropTypes.number.isRequired,
        maxScore: PropTypes.number.isRequired,
        minScore: PropTypes.number.isRequired
      }).isRequired
    ),
    resultRankings: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string.isRequired
      }).isRequired
    )
  }),
  combined: PropTypes.bool,
  followBenchmark: PropTypes.func.isRequired,
  followGuide: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  guide: PropTypes.shape({
    assessment_id: PropTypes.string.isRequired,
    competencies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    locale_key: PropTypes.string.isRequired
  }),
  isReady: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityRecommendationChart as Component};
export default withTraitify(PersonalityRecommendationChart);
