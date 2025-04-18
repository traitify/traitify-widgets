import {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import dig from "lib/common/object/dig";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeAssessmentQuery, baseState, benchmarkIDState, optionsState} from "lib/recoil";

export default function useRecommendationEffect() {
  const assessment = useLoadedValue(activeAssessmentQuery);
  const base = useRecoilValue(baseState);
  const options = useRecoilValue(optionsState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);

  useEffect(() => {
    const recommendations = dig(assessment, "recommendations") || [];
    if(recommendations.length === 0) { return; }

    const benchmarkIDs = recommendations.map(({recommendation_id: id}) => id);
    const fallbackIDs = [
      dig(options, "results", "benchmarkID"),
      base.benchmarkID,
      dig(assessment, "recommendation", "recommendation_id")
    ].filter(Boolean);

    setBenchmarkID((currentBenchmarkID) => {
      if(benchmarkIDs.includes(currentBenchmarkID)) { return currentBenchmarkID; }

      return fallbackIDs.find((id) => benchmarkIDs.includes(id)) || benchmarkIDs[0];
    });
  }, [assessment, options]);
}
