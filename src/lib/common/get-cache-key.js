// NOTE: Mirror updates in lib/recoil/cache
export default function getCacheKey(type, options = {}) {
  /* eslint-disable no-console */
  let {id} = options;
  const keys = options.scope ? [...options.scope] : [];
  const locale = options.locale || console.warn("Missing locale");

  switch(type) {
    case "assessment":
      id = id || console.warn("Missing assessmentID");
      break;
    case "benchmark":
      id = id || console.warn("Missing benchmarkID");
      break;
    case "deck":
      id = id || console.warn("Missing deckID");
      break;
    case "guide":
      id = id || console.warn("Missing ID");
      if(options.benchmarkID) { keys.push(`benchmark-${options.benchmarkID}`); }
      break;
    case "order":
      id = id || console.warn("Missing orderID");
      break;
    case "order-recommendation": {
      const {benchmarkID, packageID, profileID} = options;
      if(!profileID) { console.warn("Missing profileID"); }
      if(packageID) {
        keys.push(`package-${packageID}`);
      } else if(benchmarkID) {
        keys.push(`benchmark-${benchmarkID}`);
      } else {
        console.warn("Missing benchmarkID or packageID");
      }

      keys.push(`profile-${profileID}`);
      break;
    }
    default:
      id = id || console.warn("Missing ID");
  }
  /* eslint-enable no-console */

  if(type === "order") {
    keys.unshift(type, id);
  } else if(type === "order-recommendation") {
    keys.unshift(type);
  } else {
    keys.unshift(locale, type, id);
  }

  return ["v3", ...keys].filter(Boolean).join(".").toLowerCase();
}
