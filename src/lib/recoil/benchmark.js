/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import dig from "lib/common/object/dig";
import {assessmentQuery} from "./assessment";
import {
  benchmarkIDState,
  graphqlState,
  httpState,
  localeState
} from "./base";

// TODO: Put cache in front of queries with ability to bust it
export const benchmarkQuery = selector({
  get: async({get}) => {
    let benchmarkID = get(benchmarkIDState);
    if(!benchmarkID) {
      const assessment = get(assessmentQuery).valueMaybe();
      const recommendation = dig(assessment, "recommendation")
        || dig(assessment, "recommendations", 0);
      if(!recommendation) { return null; }

      benchmarkID = recommendation.recommendation_id;
    }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.benchmark.get,
      variables: {benchmarkID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.benchmark.path, params);

    return response;
  },
  key: "benchmark"
});
