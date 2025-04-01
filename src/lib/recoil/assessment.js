import {selector} from "recoil";
import {
  activeTypeState,
  assessmentIDState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  safeCacheKeyState
} from "./base";

export const cognitiveAssessmentQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: assessmentID, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.cognitive.get,
      variables: {localeKey: get(localeState), testID: assessmentID}
    };
    const response = await http.post({path: GraphQL.cognitive.path, params});
    if(response.errors) {
      console.warn("cognitive-assessment", response.errors); /* eslint-disable-line no-console */
      return response;
    }

    const assessment = response.data.cognitiveTest;
    if(!assessment?.completed) { return assessment; }

    cache.set(cacheKey, assessment);

    return assessment;
  },
  key: "cognitive-assessment"
});

export const externalAssessmentQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: assessmentID, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const query = {
      params: {
        query: GraphQL.external.get,
        variables: {id: assessmentID}
      },
      path: GraphQL.external.path
    };
    if(http.version === "v1") { query.version = GraphQL.external.version; }

    const response = await http.post(query);
    if(response.errors) {
      console.warn("external-assessment", response.errors); /* eslint-disable-line no-console */
      return response;
    }

    const assessment = response.data.getAssessment;
    if(!assessment?.completedAt) { return assessment; }

    cache.set(cacheKey, assessment);

    return assessment;
  },
  key: "external-assessment"
});

export const personalityAssessmentQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: assessmentID, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {
      data: "archetype,blend,instructions,recommendation,slides,types,traits",
      locale_key: get(localeState)
    };
    const http = get(httpState);
    const response = await http.get({path: `/assessments/${assessmentID}`, params});
    if(!response?.completed_at) { return response; }

    cache.set(cacheKey, response);

    return response;
  },
  key: "personality-assessment"
});

export const assessmentQuery = selector({
  get: async({get}) => {
    const type = get(activeTypeState);
    if(type === "cognitive") { return get(cognitiveAssessmentQuery); }
    if(type === "external") { return get(externalAssessmentQuery); }
    if(type === "personality") { return get(personalityAssessmentQuery); }

    return null;
  },
  key: "assessment"
});
