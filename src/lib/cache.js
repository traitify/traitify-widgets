// NOTE: Mirror updates in lib/recoil/cache
export function getCacheKey(type, options = {}) {
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
    default:
      id = id || console.warn("Missing ID");
  }
  /* eslint-enable no-console */

  return ["v3", locale, type, id, ...keys].filter(Boolean).join(".").toLowerCase();
}

export default class Cache {
  clear = () => {
    try {
      return sessionStorage.clear();
    } catch(error) { return null; }
  };
  get = (key) => {
    try {
      const data = sessionStorage.getItem(key);
      if(!data) { return data; }

      const {expiresAt, value} = JSON.parse(data);
      if(!expiresAt) { return value; }
      if(expiresAt >= Date.now()) { return value; }

      sessionStorage.removeItem(key);

      return null;
    } catch(error) { return null; }
  };
  remove = (key) => {
    try {
      return sessionStorage.removeItem(key);
    } catch(error) { return null; }
  };
  set = (key, value, options = {}) => {
    try {
      const data = {value};
      if(options.expiresAt) { data.expiresAt = options.expiresAt; }
      if(options.expiresIn) { data.expiresAt = Date.now() + options.expiresIn * 1000; }

      return sessionStorage.setItem(key, JSON.stringify(data));
    } catch(error) { return null; }
  };
}
