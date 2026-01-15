import {selector} from "recoil";
import {responseToErrors} from "lib/common/errors";
import {activeAssessmentQuery} from "lib/recoil/assessment";
import {activeIDState, appendErrorState, graphqlState, httpState, localeState} from "./base";

export const userCompletedFeedbackQuery = selector({
  key: "user-completed-feedback",
  get: async({get, set}) => {
    const assessmentID = get(activeIDState);
    const http = get(httpState);
    if(!assessmentID) { return true; }

    const path = `/feedback/assessments/${assessmentID}/status`;
    const response = await http.get(path).catch((e) => ({errors: [e.message]}));
    if(!response) { return false; }
    if(response.error || response.errors) {
      console.warn("user-completed-feedback", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "GET", path, response}));
      return true;
    }

    // TODO: Cache this if completed
    return response.status === "complete";
  }
});

export const feedbackSurveyQuery = selector({
  key: "feedback-survey",
  get: async({get, set}) => {
    const assessment = get(activeAssessmentQuery);
    const locale = get(localeState);
    const GraphQL = get(graphqlState);
    const http = get(httpState);

    const params = {
      query: GraphQL.xavier.feedbackSurvey,
      variables: {
        surveyId: assessment.deck_id,
        localeKey: locale
      }
    };
    const {path} = GraphQL.xavier;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    if(response.errors) {
      console.warn("feedback-survey", response.errors); /* eslint-disable-line no-console */
      set(appendErrorState, responseToErrors({method: "POST", path, response}));
      return null;
    }

    const {feedbackSurvey} = response.data;
    return feedbackSurvey;
  }
});
