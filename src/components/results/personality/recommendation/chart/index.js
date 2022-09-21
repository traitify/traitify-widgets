import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef} from "react";
import {Component as Paradox} from "components/paradox/results/personality/recommendation/chart";
import {sortByTypePosition} from "lib/helpers";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import Chart from "lib/helpers/stacked-chart";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
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
  const {
    assessment,
    benchmark,
    followBenchmark,
    followGuide,
    guide,
    isReady,
    translate,
    ui
  } = props;
  const state = {};
  const canvas = useRef(null);
  const chart = useRef(null);

  useDidMount(() => { ui.trigger("PersonalityRecommendationChart.initialized", {props, state}); });
  useDidMount(() => { followBenchmark(); });
  useDidMount(() => { followGuide(); });
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
      const competency = (dig(guide, "competencies") || []).find(({questionSequences}) => (
        questionSequences[0].personalityTypeId === type.id
      ));

      const dimensionRangesForType = benchmark
        ? benchmark.dimensionRanges.filter(({dimensionId}) => dimensionId === type.id)
        : [];

      const typeRange = dimensionRangesForType
        .filter((range) => score >= range.minScore && score <= range.maxScore);

      columns.push({
        data: typeRange.map((range) => ({
          color: backgroundColorFromRange(range),
          max: range.maxScore <= 10 ? range.maxScore : 10,
          min: range.minScore > 0 ? range.minScore : 1
        })),
        label: {
          heading: type.name,
          text: competency && competency.name,
          image: type.badge.image_small
        }
      });
      line.data.push({color: colorFromRange(typeRange), score});
    });

    chart.current = new Chart(ctx, {columns, line});
    chart.current.render();
  }, [
    dig(assessment, "personality_types", 0, "personality_type", "name"),
    dig(benchmark, "id"),
    dig(benchmark, "resultRankings", 0, "description"),
    dig(guide, "competencies", 0, "name")
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

PersonalityRecommendationChart.defaultProps = {assessment: null, benchmark: null, guide: null};
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
  followBenchmark: PropTypes.func.isRequired,
  followGuide: PropTypes.func.isRequired,
  guide: PropTypes.shape({
    competencies: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        questionSequences: PropTypes.arrayOf(
          PropTypes.shape({
            personalityTypeId: PropTypes.string
          }).isRequired
        ).isRequired
      }).isRequired
    )
  }),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityRecommendationChart as Component};
export default withTraitify(PersonalityRecommendationChart, {paradox: Paradox});
