import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef} from "react";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import Chart from "lib/helpers/stacked-chart";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const backgroundColorFromRange = ({match_score: score}) => {
  if(score === 5) { return "rgba(255, 210, 210, 0.5)"; }
  if(score === 10) { return "rgba(252, 239, 172, 0.5)"; }
  if(score === 20) { return "rgba(165, 229, 167, 0.5)"; }

  return "rgba(0, 0, 0, 0.5)";
};

const colorFromRange = ({match_score: score}) => {
  if(score === 5) { return "#F25749"; }
  if(score === 10) { return "#EFC354"; }
  if(score === 20) { return "#55BA60"; }

  return "black";
};

function PersonalityRecommendationChart(props) {
  const {assessment, benchmark, followBenchmark, isReady, translate, ui} = props;
  const state = {};
  const canvas = useRef(null);
  const chart = useRef(null);

  useDidMount(() => { ui.trigger("PersonalityRecommendationChart.initialized", {props, state}); });
  useDidMount(() => { followBenchmark(); });
  useDidUpdate(() => { ui.trigger("PersonalityRecommendationChart.updated", {props, state}); });
  useEffect(() => {
    if(chart.current) { chart.current.destroy(); }
    if(!canvas.current) { return; }
    if(!isReady("benchmark")) { return; }
    if(!isReady("results")) { return; }

    const ctx = canvas.current.getContext("2d");
    const columns = [];
    const line = {data: []};

    sortByTypePosition(assessment.personality_types).forEach(({personality_type: type, score}) => {
      const rangeType = benchmark.range_types.find(({id}) => id === type.id);
      const typeRange = rangeType.ranges
        .find((range) => score >= range.min_score && score <= range.max_score);

      columns.push({
        data: rangeType.ranges.map((range) => ({
          color: backgroundColorFromRange(range),
          max: range.max_score,
          min: range.min_score
        })),
        label: {text: type.name, image: type.badge.image_small}
      });
      line.data.push({color: colorFromRange(typeRange), score});
    });

    chart.current = new Chart(ctx, {columns, line});
    chart.current.render();
  }, [
    dig(assessment, ["personality_types", 0, "personality_type", "name"]),
    dig(benchmark, ["rankings", 0, "description"])
  ]);

  useLayoutEffect(() => {
    const resizeChart = () => chart.current && chart.current.resize();

    window.addEventListener("resize", resizeChart);

    resizeChart();

    return () => window.removeEventListener("resize", resizeChart);
  }, []);

  if(!isReady("benchmark")) { return null; }
  if(!isReady("results")) { return null; }

  return (
    <div className={style.container}>
      <div className={style.canvasContainer}>
        <canvas ref={canvas} width="1600" height="800" aria-label={translate("radar_chart_label")} />
      </div>
    </div>
  );
}

PersonalityRecommendationChart.defaultProps = {assessment: null, benchmark: null};
PersonalityRecommendationChart.propTypes = {
  assessment: PropTypes.shape({personality_types: PropTypes.array}),
  benchmark: PropTypes.shape({range_types: PropTypes.array}),
  followBenchmark: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityRecommendationChart as Component};
export default withTraitify(PersonalityRecommendationChart);
