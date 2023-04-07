/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {
  graphqlState,
  httpState,
  localeState,
  personalityAssessmentIDState
} from "./base";

// TODO: Put cache in front of queries with ability to bust it
// TODO: Only get if there are results...or only fetch from hook if there are results
export const guideQuery = selector({
  get: async({get}) => {
    const assessmentID = get(personalityAssessmentIDState);
    if(!assessmentID) { return null; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.guide.get,
      variables: {assessmentID, localeKey: get(localeState)}
    };
    const response = await http.post(GraphQL.guide.path, params);
    if(response.errors) { console.warn("guide", response.errors); } /* eslint-disable-line no-console */

    return response.data.guide;
  },
  key: "guide"
});
