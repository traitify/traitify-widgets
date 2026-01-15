/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {responseToErrors} from "lib/common/errors";
import {
  appendErrorState,
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  personalityAssessmentIDState,
  safeCacheKeyState
} from "./base";

export const guideQuery = selector({
  get: async({get, set}) => {
    const assessmentID = get(personalityAssessmentIDState);
    if(!assessmentID) { return null; }

    const benchmarkID = get(benchmarkIDState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({benchmarkID, id: assessmentID, type: "guide"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.guide.get,
      variables: {assessmentID, benchmarkID, localeKey: get(localeState)}
    };
    const {path} = GraphQL.guide;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("guide", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "POST", path, response}));
    }
    if(!response.data) { return null; }

    const {customInterviewGuide, guide: _guide} = response.data;
    const {clientInterviewGuide, personalityInterviewGuide} = customInterviewGuide || {};
    const guide = {client: clientInterviewGuide, personality: personalityInterviewGuide || _guide};
    if(guide.client || guide.personality) { cache.set(cacheKey, guide); }

    return (guide.client || guide.personality) ? guide : null;
  },
  key: "guide"
});
