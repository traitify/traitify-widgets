/* eslint-disable import/prefer-default-export */
import {atom, selector} from "recoil";
import {
  benchmarkIDState,
  graphqlState,
  httpState,
  localeState,
  packageIDState,
  profileIDState
} from "./base";

const assessmentsDefaultQuery = selector({
  get: async({get}) => {
    const benchmarkID = get(benchmarkIDState);
    const packageID = get(packageIDState);
    if(!benchmarkID && !packageID) { return null; }

    const profileID = get(profileIDState);
    if(!profileID) { return null; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.xavier.recommendation,
      variables: {benchmarkID, localeKey: get(localeState), packageID, profileID}
    };
    const response = await http.post(GraphQL.xavier.path, params);
    if(response.errors) { console.warn("xavier", response.errors); } /* eslint-disable-line no-console */

    const assessments = [];
    const {cognitive, personality} = response.data.recommendation.prerequisites || {};

    if(personality && personality.assessmentId) {
      assessments.push({
        completed: personality.status === "COMPLETE",
        id: personality.assessmentId,
        type: "personality"
      });
    }

    if(cognitive && cognitive.testId) {
      assessments.push({
        completed: cognitive.status === "COMPLETE",
        id: cognitive.testId,
        type: "cognitive"
      });
    }

    return assessments;
  },
  key: "assessments/default"
});

export const assessmentsState = atom({
  default: assessmentsDefaultQuery,
  key: "assessments"
});
