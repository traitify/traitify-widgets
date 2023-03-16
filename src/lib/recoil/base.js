import {atom} from "recoil";

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
