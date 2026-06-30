import {selectorFamily} from "recoil";
import {responseToErrors} from "lib/common/errors";
import {
  activeState,
  cacheState,
  graphqlState,
  httpState,
  listenerState,
  localeState,
  safeCacheKeyState
} from "./base";

export const surveyIDState = selectorFamily({
  get: (surveyType) => ({get}) => {
    const active = get(activeState);
    if(active?.surveyType !== surveyType) { return null; }

    return active.surveyID ?? null;
  },
  key: "survey-id"
});

export const personalitySurveyQuery = selectorFamily({
  get: (id) => async({get}) => {
    if(!id) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id, type: "survey"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {locale_key: get(localeState)};
    const http = get(httpState);
    const response = await http.get(`/decks/${id}`, params);
    if(response) { cache.set(cacheKey, response); }

    return response;
  },
  key: "survey/personality"
});

export const rjpSurveyQuery = selectorFamily({
  get: (id) => async({get}) => {
    if(!id) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id, type: "survey"}));
    const cached = false && cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.rjp.getSurvey,
      variables: {id, localeKey: get(localeState)}
    };
    const {path} = GraphQL.rjp;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("rjp-survey", response.errors); /* eslint-disable-line no-console */
      get(listenerState).trigger("Error.append", responseToErrors({method: "POST", path, response}));
      return null;
    }

    const survey = response.data.getSurvey;
    if(survey) { cache.set(cacheKey, survey); }

    return survey;
  },
  key: "survey/rjp"
});

export const surveyQuery = selectorFamily({
  get: (surveyType) => async({get}) => {
    const id = get(surveyIDState(surveyType));

    if(surveyType === "personality") { return get(personalitySurveyQuery(id)); }
    if(surveyType === "rjp") { return get(rjpSurveyQuery(id)); }

    return null;
  },
  key: "survey"
});
