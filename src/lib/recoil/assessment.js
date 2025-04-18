import {selector, selectorFamily} from "recoil";
import {
  activeIDState,
  activeTypeState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  safeCacheKeyState
} from "./base";

export const cognitiveAssessmentQuery = selectorFamily({
  get: (id) => async({get}) => {
    if(!id) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.cognitive.get,
      variables: {localeKey: get(localeState), testID: id}
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
  key: "assessment/cognitive"
});

export const externalAssessmentQuery = selectorFamily({
  get: (id) => async({get}) => {
    if(!id) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const query = {
      params: {
        query: GraphQL.external.get,
        variables: {id}
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
  key: "assessment/external"
});

export const personalityAssessmentQuery = selectorFamily({
  get: (id) => async({get}) => {
    console.log("personalityAssessmentQuery", id);
    if(!id) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id, type: "assessment"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {
      data: "archetype,blend,instructions,recommendation,slides,types,traits",
      locale_key: get(localeState)
    };
    const http = get(httpState);
    const response = await http.get({path: `/assessments/${id}`, params});
    if(!response?.completed_at) { return response; }

    cache.set(cacheKey, response);

    return response;
  },
  key: "assessment/personality"
});

export const assessmentQuery = selectorFamily({
  get: ({id, surveyType}) => async({get}) => {
    console.log("assessmentQuery", id, surveyType);
    if(surveyType === "cognitive") { return get(cognitiveAssessmentQuery(id)); }
    if(surveyType === "external") { return get(externalAssessmentQuery(id)); }
    if(surveyType === "personality") { return get(personalityAssessmentQuery(id)); }

    return null;
  },
  key: "assessment"
});

export const activeAssessmentQuery = selector({
  get: async({get}) => {
    const id = get(activeIDState);
    const surveyType = get(activeTypeState);
    console.log("activeAssessmentQuery", id, surveyType);

    return get(assessmentQuery({id, surveyType}));
  },
  key: "assessment/active"
});
