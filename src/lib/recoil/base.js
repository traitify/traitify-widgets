import {atom, selector} from "recoil";

export const activeState = atom({key: "active"});
export const benchmarkIDState = atom({key: "benchmark-id"});
export const cacheState = atom({dangerouslyAllowMutability: true, key: "cache"});
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

export const assessmentIDState = selector({
  get: ({get}) => {
    const active = get(activeState);
    if(!active) { return null; }
    if(active.type !== "personality") { return null; }

    return active.id;
  },
  key: "assessment-id"
});
export const testIDState = selector({
  get: ({get}) => {
    const active = get(activeState);
    if(!active) { return null; }
    if(active.type !== "cognitive") { return null; }

    return active.id;
  },
  key: "test-id"
});
