/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {
  assessmentIDState,
  httpState,
  localeState
} from "./base";

export const assessmentQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const params = {
      data: "archetype,blend,instructions,recommendation,slides,types,traits",
      image_pack: "white",
      locale_key: get(localeState)
    };
    const http = get(httpState);
    const response = await http.get(`/assessments/${assessmentID}`, params);

    return response;
  },
  key: "assessment"
});
