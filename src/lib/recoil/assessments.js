/* eslint-disable import/prefer-default-export */
import {atom, selector} from "recoil";
import capitalize from "lib/common/string/capitalize";
import {
  baseState,
  graphqlState,
  httpState,
  localeState,
  optionsState
} from "./base";

const baseAssessmentState = selector({
  get: ({get}) => {
    const {assessmentID} = get(baseState);
    const type = get(optionsState).surveyType || "personality";

    return [{id: assessmentID, name: `${capitalize(type)} Assessment`, type}];
  },
  key: "assessments/default/assessment"
});

const baseRecommendationQuery = selector({
  get: async({get}) => {
    const {benchmarkID, packageID, profileID} = get(baseState);
    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.xavier.recommendation,
      variables: {benchmarkID, localeKey: get(localeState), packageID, profileID}
    };
    const response = await http.post(GraphQL.xavier.path, params);
    if(response.errors) { console.warn("xavier", response.errors); } /* eslint-disable-line no-console */

    const assessments = [];
    const {
      cognitive,
      external,
      personality
    } = response.data.recommendation.prerequisites || {};

    if(personality && personality.assessmentId) {
      assessments.push({
        completed: personality.status === "COMPLETE",
        id: personality.assessmentId,
        name: "Personality Assessment",
        type: "personality"
      });
    }

    if(cognitive && cognitive.testId) {
      assessments.push({
        completed: cognitive.status === "COMPLETE",
        id: cognitive.testId,
        name: "Cognitive Assessment",
        type: "cognitive"
      });
    }

    if(external) {
      external.forEach((assessment) => {
        assessments.push({
          completed: assessment.status === "COMPLETE",
          id: assessment.assessmentId,
          link: assessment.link,
          name: assessment.surveyName,
          type: "external"
        });
      });
    }

    return assessments;
  },
  key: "assessments/default/recommendation"
});

const assessmentsDefaultQuery = selector({
  get: async({get}) => {
    const {assessmentID, benchmarkID, packageID, profileID} = get(baseState);

    if(profileID && (benchmarkID || packageID)) { return get(baseRecommendationQuery); }
    if(assessmentID) { return get(baseAssessmentState); }

    return null;
  },
  key: "assessments/default"
});

export const assessmentsState = atom({
  default: assessmentsDefaultQuery,
  key: "assessments"
});
