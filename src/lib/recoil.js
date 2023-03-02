import {atom, selector} from "recoil";
import dig from "lib/common/object/dig";

export const assessmentIDState = atom({key: "assessment-id"});
export const benchmarkIDState = atom({key: "benchmark-id"});
export const errorState = atom({key: "error"});
export const graphqlState = atom({dangerouslyAllowMutability: true, key: "graphql"});
export const httpState = atom({dangerouslyAllowMutability: true, key: "http"});
export const i18nState = atom({dangerouslyAllowMutability: true, key: "i18n"});
export const listenerState = atom({dangerouslyAllowMutability: true, key: "listener"});
export const loadingState = atom({default: true, key: "loading"});
export const localeState = atom({
  default: "en-us",
  effects: [
    ({onSet, setSelf}) => {
      onSet((value) => setSelf(value.toLowerCase()));
    }
  ],
  key: "locale"
});
export const optionsState = atom({key: "options"});
export const profileIDState = atom({key: "profile-id"});

// TODO: Put cache in front of queries with ability to bust it
export const assessmentQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const params = {
      data: "archetype,blend,instructions,recommendation,slides,types,traits",
      image_pack: "white",
      locale_key: get(localeState)
    };
    const http = get(httpState);
    const response = await http.get(`/assessments/${assessmentID}`, params);

    return response;
  },
  key: "assessment"
});

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

export const deckQuery = selector({
  get: async({get}) => {
    const assessment = get(assessmentQuery);
    if(!assessment) { return null; }

    const deckID = assessment.deck_id;
    const params = {locale_key: get(localeState)};
    const http = get(httpState);
    const response = await http.get(`/decks/${deckID}`, params);

    return response;
  },
  key: "deck"
});

export const guideQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.guide.get,
      variables: {assessmentID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.guide.path, params);

    return response;
  },
  key: "guide"
});
