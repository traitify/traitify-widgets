/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {
  cacheState,
  httpState,
  safeCacheKeyState
} from "./base";

export const organizationSettingsQuery = selector({
  get: async({get}) => {
    const http = get(httpState);
    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: http.authKey || "none", type: "organization"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    // TODO: Remove ID when endpoint is updated
    const organizationID = "9011ec18-9e85-4282-8b52-1cb850719e15";
    const response = await http.get(`/organizations/${organizationID}/settings`);
    if(response) { cache.set(cacheKey, response, {expiresIn: 60 * 24}); }

    return response;
  },
  key: "organization-settings"
});
