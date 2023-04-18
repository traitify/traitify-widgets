import {noWait, selector} from "recoil";
import {assessmentQuery} from "./assessment";
import {
  activeTypeState,
  cacheState,
  httpState,
  localeState,
  safeCacheKeyState
} from "./base";

export const deckIDState = selector({
  get: ({get}) => {
    const type = get(activeTypeState);
    if(type !== "personality") { return null; }

    const loadable = get(noWait(assessmentQuery));
    if(loadable.state !== "hasValue") { return null; }

    return loadable.contents?.deck_id;
  },
  key: "deck-id"
});

export const deckQuery = selector({
  get: async({get}) => {
    const deckID = await get(deckIDState);
    if(!deckID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: deckID, type: "deck"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const params = {locale_key: get(localeState)};
    const http = get(httpState);
    const response = await http.get(`/decks/${deckID}`, params);
    if(response) { cache.set(cacheKey, response); }

    return response;
  },
  key: "deck"
});
