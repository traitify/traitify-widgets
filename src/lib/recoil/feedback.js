import {selector} from "recoil";
import {getIsUserCompletedFeedback} from "components/results/feedback/feedback-survey";
import {assessmentQuery} from "lib/recoil/assessment";
import {assessmentIDState, graphqlState, httpState, localeState} from "./base";

export const userCompletedFeedbackQuery = selector({
  key: "user-completed-feedback",
  get: async({get}) => {
    const assessmentID = get(assessmentIDState);
    const http = get(httpState);
    const isUserCompletedFeedback = await getIsUserCompletedFeedback(assessmentID, http);
    return isUserCompletedFeedback;
  }
});

export const feedbackSurveyQuery = selector({
  key: "feedback-survey",
  get: async({get}) => {
    const assessment = get(assessmentQuery);
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
    const response = await http.post(GraphQL.xavier.path, params);
    if(response.errors) {
      console.warn("benchmark", response.errors); /* eslint-disable-line no-console */
      return null;
    }
    const {feedbackSurvey} = response.data;
    return feedbackSurvey;
  }
});
