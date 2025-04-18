import {atom, selector} from "recoil";
import orderFromQuery, {overrides} from "lib/common/order-from-query";
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

    return {
      assessments: [{id: assessmentID, surveyType: type}],
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
    const overrideState = localStorage.getItem("order-override");
    if(overrideState) { params.variables.id = overrides[overrideState]; }

    const response = await http.post(GraphQL.order.path, params);
    const order = orderFromQuery(response);
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

const updateStatus = ({onSet, setSelf}) => {
  onSet((order) => {
    if(!order) { return; }
    if(order.completed) { return; }
    if(order.assessments.length === 0) { return; }
    if(order.assessments.length !== order.surveys.length) { return; }
    if(order.assessments.some(({completed}) => !completed)) { return; }

    setSelf({...order, completed: true, status: "completed"});
  });
};

export const orderState = atom({
  default: orderDefaultQuery,
  effects: [updateStatus],
  key: "order"
});
