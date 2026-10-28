// NOTE: Selectors will trigger on every option change unless memoized
import {selector} from "recoil";
import {optionsState} from "./base";

export const applyAssessmentExpirationState = selector({
  get: ({get}) => get(optionsState).applyAssessmentExpiration,
  key: "options/apply-assessment-expiration"
});

export const careerOptionsState = selector({
  get: ({get}) => get(optionsState).career,
  key: "options/career"
});

export const imagekitState = selector({
  get: ({get}) => get(optionsState).imagekit,
  key: "options/imagekit"
});

export const retryRecommendationState = selector({
  get: ({get}) => get(optionsState).retryRecommendationOnIncompletePersonality,
  key: "options/retry-recommendation"
});

export const surveyTypeState = selector({
  get: ({get}) => get(optionsState).surveyType,
  key: "options/survey-type"
});
