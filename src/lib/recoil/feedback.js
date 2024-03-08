import {atom, selector} from "recoil";
import {assessmentIDState, graphqlState, httpState} from "./base";

export const feedbackModalShowState = atom({key: "feedback-modal-show", default: false});

export const userCompletedFeedbackQuery = selector({
  key: "user-completed-feedback",
  get: ({get}) => {
    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return true; }

    // TODO check status
    // const http = get(httpState);
    // const resp = http.get(`/feedback/assessments/${assessmentID}/status`);
    // console.log("resp :>> ", resp);
    return false;
  }
});

export const feedbackSurveyQuery = selector({
  key: "feedback-survey",
  get: async({get}) => {
    const userCompletedFeedback = get(userCompletedFeedbackQuery);
    if(userCompletedFeedback) { return null; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);

    const params = {
      query: GraphQL.xavier.feedbackSurvey,
      variables: {
        surveyId: "big-five", // TODO parametrize
        localeKey: "en-us"
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
