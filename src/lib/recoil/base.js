import {atom, selector, selectorFamily} from "recoil";
import {getCacheKey} from "lib/cache";

export const activeState = atom({default: null, key: "active"});
export const benchmarkIDState = atom({default: null, key: "benchmark-id"});
export const cacheState = atom({dangerouslyAllowMutability: true, default: null, key: "cache"});
export const errorState = atom({default: null, key: "error"});
export const graphqlState = atom({dangerouslyAllowMutability: true, default: null, key: "graphql"});
export const httpState = atom({dangerouslyAllowMutability: true, default: null, key: "http"});
export const i18nState = atom({dangerouslyAllowMutability: true, default: null, key: "i18n"});
export const listenerState = atom({dangerouslyAllowMutability: true, default: null, key: "listener"});
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
export const optionsState = atom({default: null, key: "options"});
export const packageIDState = atom({default: null, key: "package-id"});
export const profileIDState = atom({default: null, key: "profile-id"});

// NOTE: Breaking up state prevents over-triggering selectors
export const activeIDState = selector({
  get: ({get}) => {
    const active = get(activeState);
    if(!active) { return null; }

    return active.id;
  },
  key: "active-id"
});

export const activeTypeState = selector({
  get: ({get}) => {
    const active = get(activeState);
    if(!active) { return null; }

    return active.type;
  },
  key: "active-type"
});

export const assessmentIDState = selector({
  get: ({get}) => get(activeIDState),
  key: "assessment-id"
});

export const personalityAssessmentIDState = selector({
  get: ({get}) => {
    const type = get(activeTypeState);
    if(type !== "personality") { return null; }

    return get(activeIDState);
  },
  key: "personality-assessment-id"
});

export const safeCacheKeyState = selectorFamily({
  get: (params) => ({get}) => {
    const [type, options] = typeof params === "string"
      ? [params, {}]
      : [params.type, params];

    return getCacheKey(type, {...options, locale: options.locale || get(localeState)});
  },
  key: "safe-cache-key"
});
