import {selector} from "recoil";
import camelCase from "lib/common/string/camel-case";
import {
  cacheState,
  httpState,
  safeCacheKeyState
} from "./base";

export const settingsQuery = selector({
  get: async({get}) => {
    const http = get(httpState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: http.authKey || "none", type: "settings"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const response = await http.get("/organizations/settings");
    if(!response) { return; }
    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      return;
    }

    const settings = Object.keys(response).reduce(
      (newObject, key) => ({...newObject, [camelCase(key)]: response[key]}),
      {}
    );
    cache.set(cacheKey, settings, {expiresIn: 60 * 60 * 3});

    return settings;
  },
  key: "settings"
});

export const translationsQuery = selector({
  get: async({get}) => {
    const http = get(httpState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: http.authKey || "none", type: "translations"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const response = await http.get("/xavier/translations", {project: "widgets"});
    if(!response) { return; }
    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      return;
    }

    cache.set(cacheKey, response, {expiresIn: 60 * 60 * 3});

    return response;
  },
  key: "translations"
});
