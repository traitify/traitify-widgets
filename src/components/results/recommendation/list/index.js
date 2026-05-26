import {useRecoilState} from "recoil";
import Dropdown from "components/common/dropdown";
import useBenchmarkTag from "lib/hooks/use-benchmark-tag";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useRecommendation from "lib/hooks/use-recommendation";
import useRecommendations from "lib/hooks/use-recommendations";
import useTranslate from "lib/hooks/use-translate";
import {benchmarkIDState} from "lib/recoil";
import style from "./style.scss";

export default function RecommendationList() {
  const benchmarkTag = useBenchmarkTag();
  const disabled = useDisabledComponent("RecommendationList");
  const disabledScore = useDisabledComponent("RecommendationScore");
  const recommendation = useRecommendation();
  const recommendations = useRecommendations();
  const [benchmarkID, setBenchmarkID] = useRecoilState(benchmarkIDState);
  const translate = useTranslate();

  useComponentEvents("RecommendationList", {benchmarkID, benchmarkTag, recommendation, recommendations});
  // TODO: Why don't we have a recommendation locally when the benchmark ID is passed directly
  // AND I just did 2 assessments
  console.log(recommendation);

  if(disabled) { return null; }
  if(!recommendation) { return null; }

  const description = [
    !disabledScore && recommendation.match_score,
    recommendation.description
  ].filter(Boolean).join(" - ");
  const descriptionStyle = recommendation.visual_hex_value && {
    background: recommendation.visual_hex_value
  };
  const filteredRecommendations = benchmarkTag
    ? recommendations.filter(({benchmark_tag: tag}) => tag === benchmarkTag)
    : recommendations;
  const onBenchmarkChange = ({target: {value}}) => { setBenchmarkID(value); };
  const options = filteredRecommendations
    .map(({benchmark_name: name, recommendation_id: value}) => ({name, value}));

  return (
    <section className={style.container}>
      <div className={style.recommendations}>
        <Dropdown
          className={style.dropdown}
          currentText={translate("results.benchmarks.current")}
          id="traitify-benchmark-id"
          name="benchmark_id"
          onChange={onBenchmarkChange}
          options={options}
          searchText={translate("results.benchmarks.search")}
          value={benchmarkID}
        />
        {description && (
          <div className={style.recommendation} style={descriptionStyle}>
            {description}
          </div>
        )}
      </div>
    </section>
  );
}
