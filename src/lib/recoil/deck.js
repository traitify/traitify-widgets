/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {assessmentQuery} from "./assessment";
import {
  httpState,
  localeState
} from "./base";

// TODO: Put cache in front of queries with ability to bust it
export const deckQuery = selector({
  get: async({get}) => {
    const assessment = await get(assessmentQuery);
    if(!assessment) { return null; }

    const deckID = assessment.deck_id;
    const params = {locale_key: get(localeState)};
    const http = get(httpState);
    const response = await http.get(`/decks/${deckID}`, params);

    return response;
  },
  key: "deck"
});
