/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {
  cacheState,
  graphqlState,
  httpState,
  localeState,
  personalityAssessmentIDState,
  safeCacheKeyState
} from "./base";

export const guideQuery = selector({
  get: async({get}) => {
    const assessmentID = get(personalityAssessmentIDState);
    if(!assessmentID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: assessmentID, type: "guide"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.guide.get,
      variables: {assessmentID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.guide.path, params);
    if(response.errors) { console.warn("guide", response.errors); } /* eslint-disable-line no-console */

    const {guide} = response.data;
    if(guide) { cache.set(cacheKey, guide); }

    return guide;
  },
  key: "guide"
});
