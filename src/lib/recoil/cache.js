/* eslint-disable import/prefer-default-export */
import {selectorFamily} from "recoil";
import {
  assessmentIDState,
  benchmarkIDState,
  localeState
} from "./base";
import {deckIDState} from "./deck";

// NOTE: Mirror updates in lib/common/get-cache-key
export const cacheKeyState = selectorFamily({
  get: (params) => ({get}) => {
    const [type, options] = typeof params === "string"
      ? [params, {}]
      : [params.type, params];
    let {id} = options;
    const keys = options.scope ? [...options.scope] : [];
    const locale = options.locale || get(localeState);

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
      case "guide": {
        const benchmarkID = options.benchmarkID || get(benchmarkIDState);
        if(benchmarkID) { keys.push(`benchmark-${benchmarkID}`); }

        id = id || get(assessmentIDState);
        break;
      }
      default:
        id = id || get(assessmentIDState);
    }

    return ["v3", locale, type, id, ...keys].filter(Boolean).join(".").toLowerCase();
  },
  key: "cache-key"
});
