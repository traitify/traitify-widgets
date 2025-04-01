import {atom, selector} from "recoil";
import {
  baseState,
  cacheState,
  graphqlState,
  httpState,
  localeState,
  optionsState,
  orderIDState,
  safeCacheKeyState
} from "./base";

// NOTE: Order
// - assessments - completed, id, link (optional), surveyID, surveyName (optional), surveyType
// - completed
// - errors (optional)
// - status - completed, error, loading, incomplete
// - surveys - id, type

const baseAssessmentState = selector({
  get: ({get}) => {
    const {assessmentID} = get(baseState);
    const type = get(optionsState).surveyType || "personality";

    // NOTE: useAssessmentEffect/useOrderEffect will provide completed, link, surveyID, surveyName
    return {
      assessments: [{
        id: assessmentID,
        surveyType: type
      }],
      completed: false,
      status: "loading",
      surveys: [{type}]
    };
  },
  key: "order/default/assessment"
});

export const baseOrderQuery = selector({
  get: async({get}) => {
    const orderID = get(orderIDState);
    if(!orderID) { return null; }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({id: orderID, type: "order"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.order.get,
      variables: {id: orderID}
    };

    // TODO: Remove overrides when API is ready
    const overrides = {
      all: "098d5e03-0606-42f0-8086-7cde8eb25a1c",
      completed: "71df3e54-2e06-40bb-a3c5-49d39957bd39",
      draft: "5135d0e0-033e-4c96-81b1-8be2036fb62a"
    };
    const overrideState = localStorage.getItem("order-override");
    if(overrideState) { params.variables.id = overrides[overrideState]; }

    const response = await http.post(GraphQL.order.path, params);
    if(response.errorMessage) { console.warn("order", response.errors); } /* eslint-disable-line no-console */

    const _order = response.data.order;
    if(!_order) { return null; }

    // NOTE: useAssessmentEffect/useOrderEffect will provide each assessment's link (external)
    const order = {
      assessments: _order.assessments.map((assessment) => ({
        completed: assessment.status === "COMPLETE",
        id: assessment.id,
        surveyID: assessment.surveyId,
        surveyType: assessment.type.toLowerCase()
      })),
      completed: _order.status === "COMPLETED",
      status: {
        ALL_ASSESSMENT_AVAILABLE: "incomplete",
        COMPLETED: "completed",
        DRAFT: "loading",
        FAILED: "error"
      }[_order.status],
      surveys: _order.requirements.surveys.map(({id, type}) => ({
        id,
        type: type.toLowerCase()
      }))
    };

    if(response.errorMessage) { order.errors = [response.errorMessage]; }
    if(order.completed) { cache.set(cacheKey, order); }

    return order;
  },
  key: "order/default/order"
});

const baseRecommendationQuery = selector({
  get: async({get}) => {
    const {benchmarkID, packageID, profileID} = get(baseState);

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState({benchmarkID, packageID, profileID, type: "order-recommendation"}));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const params = {
      query: GraphQL.xavier.recommendation,
      variables: {benchmarkID, localeKey: get(localeState), packageID, profileID}
    };
    const response = await http.post(GraphQL.xavier.path, params);
    if(response.errors) { console.warn("xavier", response.errors); } /* eslint-disable-line no-console */

    const assessments = [];
    const surveys = [];
    const {
      cognitive,
      external,
      personality
    } = response.data.recommendation.prerequisites || {};

    if(personality && personality.assessmentId) {
      assessments.push({
        completed: personality.status === "COMPLETE",
        id: personality.assessmentId,
        surveyID: personality.surveyId,
        surveyName: personality.surveyName,
        surveyType: "personality"
      });
      surveys.push({id: personality.surveyId, type: "personality"});
    }

    if(cognitive && cognitive.testId) {
      assessments.push({
        completed: cognitive.status === "COMPLETE",
        id: cognitive.testId,
        surveyID: cognitive.surveyId,
        surveyName: cognitive.surveyName,
        surveyType: "cognitive"
      });
      surveys.push({id: cognitive.surveyId, type: "cognitive"});
    }

    if(external) {
      external.forEach((assessment) => {
        assessments.push({
          completed: assessment.status === "COMPLETE",
          id: assessment.assessmentId,
          link: assessment.assessmentTakerUrl,
          surveyID: assessment.surveyId,
          surveyName: assessment.surveyName,
          surveyType: "external"
        });
        surveys.push({id: assessment.surveyId, type: "external"});
      });
    }

    const order = {
      assessments,
      completed: assessments.every(({completed}) => completed),
      errors: response.errors,
      surveys
    };

    if(order.completed) {
      order.status = "completed";
    } else if(response.errors) {
      order.status = "error";
    } else {
      order.status = "incomplete";
    }

    if(order.completed) { cache.set(cacheKey, order); }

    return order;
  },
  key: "order/default/recommendation"
});

const orderDefaultQuery = selector({
  get: async({get}) => {
    const {assessmentID, benchmarkID, orderID, packageID, profileID} = get(baseState);

    if(orderID) { return get(baseOrderQuery); }
    if(profileID && (benchmarkID || packageID)) { return get(baseRecommendationQuery); }
    if(assessmentID) { return get(baseAssessmentState); }

    return null;
  },
  key: "order/default"
});

export const orderState = atom({
  default: orderDefaultQuery,
  key: "order"
});
