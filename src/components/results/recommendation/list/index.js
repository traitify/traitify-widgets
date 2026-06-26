import {useRecoilState} from "recoil";
import Dropdown from "components/common/dropdown";
import useBenchmarkTag from "lib/hooks/use-benchmark-tag";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useRecommendation from "lib/hooks/use-recommendation";
import useRecommendations from "lib/hooks/use-recommendations";
import useSetting from "lib/hooks/use-setting";
import useTranslate from "lib/hooks/use-translate";
import {benchmarkIDState} from "lib/recoil";
import style from "./style.scss";

export default function RecommendationList() {
  const [benchmarkID, setBenchmarkID] = useRecoilState(benchmarkIDState);
  const benchmarkTag = useBenchmarkTag();
  const disabled = useDisabledComponent("RecommendationList");
  const disabledScore = useDisabledComponent("RecommendationScore");
  const recommendation = useRecommendation();
  const recommendations = useRecommendations();
  const redactAfter = useSetting("redactRecommendationAfter");
  const showHeaders = useOption("showHeaders");
  const translate = useTranslate();

  useComponentEvents("RecommendationList", {benchmarkID, benchmarkTag, recommendation, recommendations});

  if(disabled) { return null; }
  if(!recommendation) { return null; }

  const redacted = redactAfter && recommendation.created_at
    && Date.now() - recommendation.created_at > redactAfter;
  const description = !redacted && [
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
      {showHeaders && (
        <>
          <div className={style.sectionHeading}>{translate("results.benchmarks.compare.heading")}</div>
          <div className={style.p}>{translate("results.benchmarks.compare.description")}</div>
        </>
      )}
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
