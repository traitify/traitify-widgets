/* eslint-disable import/prefer-default-export */
import {selectorFamily} from "recoil";
import {
  assessmentIDState,
  benchmarkIDState,
  localeState
} from "./base";
import {deckIDState} from "./deck";

export const cacheKeyState = selectorFamily({
  get: (type, options = {}) => ({get}) => {
    let {id} = options;
    const keys = [];
    const locale = options.locale || get(localeState);

    // NOTE: Add additional options to keys
    switch(type) {
      case "assessment":
        id = id || get(assessmentIDState);
        break;
      case "benchmark":
        id = id || get(benchmarkIDState);
        break;
      case "deck":
        id = id || get(deckIDState);
        break;
      default:
        id = id || get(assessmentIDState);
    }

    return [locale, type, id, ...keys].filter(Boolean).join(".");
  },
  key: "cache-key"
});
