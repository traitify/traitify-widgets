/* eslint-disable import/prefer-default-export */
import {selectorFamily} from "recoil";
import {
  activeIDState,
  benchmarkIDState,
  localeState,
  orderIDState,
  packageIDState,
  profileIDState
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
        id = id || get(activeIDState);
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

        id = id || get(activeIDState);
        break;
      }
      case "order":
        id = id || get(orderIDState);
        break;
      case "order-recommendation": {
        const packageID = options.packageID || get(packageIDState);
        const profileID = options.profileID || get(profileIDState);
        if(packageID) {
          keys.push(`package-${packageID}`);
        } else {
          const benchmarkID = options.benchmarkID || get(benchmarkIDState);
          if(benchmarkID) { keys.push(`benchmark-${benchmarkID}`); }
        }

        keys.push(`profile-${profileID}`);
        break;
      }
      default:
        id = id || get(activeIDState);
    }

    if(type === "order") {
      keys.unshift(type, id);
    } else if(type === "order-recommendation") {
      keys.unshift(type);
    } else {
      keys.unshift(locale, type, id);
    }

    return ["v3", ...keys].filter(Boolean).join(".").toLowerCase();
  },
  key: "cache-key"
});
