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
    default:
      id = id || console.warn("Missing ID");
  }
  /* eslint-enable no-console */

  return ["v3", locale, type, id, ...keys].filter(Boolean).join(".").toLowerCase();
}
