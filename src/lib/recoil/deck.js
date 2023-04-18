import {noWait, selector} from "recoil";
import {assessmentQuery} from "./assessment";
import {
  activeTypeState,
  httpState,
  localeState
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

// TODO: Put cache in front of queries with ability to bust it
export const deckQuery = selector({
  get: async({get}) => {
    const deckID = await get(deckIDState);
    if(!deckID) { return null; }

    const params = {locale_key: get(localeState)};
    const http = get(httpState);
    const response = await http.get(`/decks/${deckID}`, params);

    return response;
  },
  key: "deck"
});
