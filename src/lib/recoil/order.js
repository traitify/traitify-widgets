import {DefaultValue, atom, selector} from "recoil";
import orderFromQuery, {orderFromRecommendation} from "lib/common/order-from-query";
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
// - assessments
//   - completed
//   - id
//   - link (optional)
//   - profileID
//   - surveyID
//   - surveyName (optional)
//   - surveyType
// - cacheKey
// - completed
// - errors (optional)
// - origin
// - status - completed, error, loading, incomplete, timeout
//   - timeout occurs when no longer loading but still not incomplete (missing assessments)
// - surveys - id, type

const baseAssessmentState = selector({
  get: ({get}) => {
    const {assessmentID} = get(baseState);
    const type = get(optionsState).surveyType || "personality";

    return {
      assessments: [{id: assessmentID, surveyType: type}],
      completed: false,
      origin: {assessmentID},
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

    const response = await http.post(GraphQL.order.path, params);
    const order = orderFromQuery(response);
    order.cacheKey = cacheKey;
    order.origin = {orderID};
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
    const order = orderFromRecommendation(response);
    order.cacheKey = cacheKey;
    order.origin = {benchmarkID, packageID, profileID};
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

const updateStatus = ({getLoadable, onSet, setSelf}) => {
  onSet((order, oldOrder) => {
    if(!order) { return; }
    if(order instanceof DefaultValue) { return; }

    const cacheOrder = (newOrder) => {
      const cache = getLoadable(cacheState).contents;
      const {cacheKey} = newOrder;
      if(!cache || !cacheKey) { return; }

      cache.set(cacheKey, newOrder);
    };

    if(order.completed && !oldOrder?.completed) {
      cacheOrder(order);
      return;
    }

    if(order.errors) { return; }
    if(order.assessments.length === 0 || order.assessments.length !== order.surveys.length) {
      if(["loading", "timeout"].includes(order.status)) { return; }

      setSelf({...order, status: "loading"});
      return;
    }

    if(order.assessments.some(({skipped}) => skipped) || order.status === "skipped") {
      const newOrder = {...order, completed: true, status: "skipped"};
      cacheOrder(newOrder);
      setSelf(newOrder);
      return;
    }
    if(order.assessments.some(({completed}) => !completed)) { return; }

    const newOrder = {...order, completed: true, status: "completed"};
    cacheOrder(newOrder);
    setSelf(newOrder);
  });
};

export const orderState = atom({
  default: orderDefaultQuery,
  effects: [updateStatus],
  key: "order"
});
