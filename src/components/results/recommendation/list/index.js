import {useRecoilState} from "recoil";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useRecommendation from "lib/hooks/use-recommendation";
import useRecommendations from "lib/hooks/use-recommendations";
import {benchmarkIDState} from "lib/recoil";
import style from "./style.scss";

export default function RecommendationList() {
  const disabled = useDisabledComponent("RecommendationList");
  const disabledScore = useDisabledComponent("RecommendationScore");
  const recommendation = useRecommendation();
  const recommendations = useRecommendations();
  const [benchmarkID, setBenchmarkID] = useRecoilState(benchmarkIDState);

  useComponentEvents("RecommendationList", {benchmarkID, recommendation, recommendations});

  if(disabled) { return null; }
  if(!recommendation) { return null; }

  const benchmarkTag = recommendation.benchmark_tag;
  const filteredRecommendations = benchmarkTag
    ? recommendations.filter(({benchmark_tag: tag}) => tag === benchmarkTag)
    : recommendations;
  const onBenchmarkChange = ({target: {value}}) => { setBenchmarkID(value); };

  return (
    <section className={style.container}>
      <div className={style.recommendations}>
        <label htmlFor="traitify-benchmark-id">
          <select id="traitify-benchmark-id" name="recommendation" onChange={onBenchmarkChange} value={benchmarkID}>
            {filteredRecommendations.map(({benchmark_name: name, recommendation_id: id}) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <div className={style.recommendation} style={{background: recommendation.visual_hex_value}}>
          {disabledScore ? (
            recommendation.description
          ) : (
            `${recommendation.match_score} - ${recommendation.description}`
          )}
        </div>
      </div>
    </section>
  );
}
