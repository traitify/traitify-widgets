import {selector} from "recoil";
import {responseToErrors} from "lib/common/errors";
import camelCase from "lib/common/string/camel-case";
import {
  appendErrorState,
  cacheState,
  httpState,
  safeCacheKeyState
} from "./base";

export const settingsQuery = selector({
  get: async({get, set}) => {
    const http = get(httpState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: http.authKey || "none", type: "settings"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const path = "/organizations/settings";
    const response = await http.get(path).catch((e) => ({errors: [e.message]}));
    if(!response) { return; }
    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "GET", path, response}));
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
  get: async({get, set}) => {
    const http = get(httpState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: http.authKey || "none", type: "translations"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const path = "/xavier/translations";
    const response = await http.get(path, {project: "widgets"}).catch((e) => ({errors: [e.message]}));
    if(!response) { return; }
    if(response.errors) {
      console.warn("test", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "GET", path, response}));
      return;
    }

    cache.set(cacheKey, response, {expiresIn: 60 * 60 * 3});

    return response;
  },
  key: "translations"
});
