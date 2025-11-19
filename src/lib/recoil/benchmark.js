import {noWait, selector} from "recoil";
import {responseToErrors} from "lib/common/errors";
import dig from "lib/common/object/dig";
import {activeAssessmentQuery} from "./assessment";
import {
  appendErrorState,
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  safeCacheKeyState
} from "./base";

export const benchmarkQuery = selector({
  get: async({get, set}) => {
    const benchmarkID = get(benchmarkIDState);
    if(!benchmarkID) { return null; }

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
    const {path} = GraphQL.benchmark;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("benchmark", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "POST", path, response}));
    }
    if(!response.data) { return null; }

    const benchmark = response.data.getDimensionRangeBenchmark;
    if(benchmark) { cache.set(cacheKey, benchmark); }

    return benchmark;
  },
  key: "benchmark"
});

export const benchmarkTagState = selector({
  get: ({get}) => {
    const loadable = get(noWait(activeAssessmentQuery));
    const assessment = loadable.state === "hasValue" ? loadable.contents : {};
    return dig(assessment, "recommendation", "benchmark_tag");
  },
  key: "benchmark/tag"
});
