/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {
  assessmentIDState,
  graphqlState,
  httpState,
  localeState
} from "./base";

// TODO: Put cache in front of queries with ability to bust it
export const guideQuery = selector({
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.guide.get,
      variables: {assessmentID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.guide.path, params);

    return response;
  },
  key: "guide"
});
