/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import dig from "lib/common/object/dig";
import {assessmentQuery} from "./assessment";
import {
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  safeCacheKeyState
} from "./base";

export const benchmarkQuery = selector({
  get: async({get}) => {
    let benchmarkID = get(benchmarkIDState);
    if(!benchmarkID) {
      const assessment = await get(assessmentQuery);
      const recommendation = dig(assessment, "recommendation")
        || dig(assessment, "recommendations", 0);
      if(!recommendation) { return null; }

      benchmarkID = recommendation.recommendation_id;
    }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: benchmarkID, type: "benchmark"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.benchmark.get,
      variables: {benchmarkID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.benchmark.path, params);
    if(response.errors) { console.warn("benchmark", response.errors); } /* eslint-disable-line no-console */

    const benchmark = response.data.getDimensionRangeBenchmark;
    if(benchmark) { cache.set(cacheKey, benchmark); }

    return benchmark;
  },
  key: "benchmark"
});
