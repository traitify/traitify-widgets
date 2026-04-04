import {DefaultValue, atom, selector} from "recoil";
import {responseToErrors} from "lib/common/errors";
import orderFromQuery, {orderFromRecommendation} from "lib/common/order-from-query";
import {
  baseState,
  cacheState,
  graphqlState,
  httpState,
  listenerState,
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
    const {path} = GraphQL.order;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    const order = orderFromQuery(response);
    order.cacheKey = cacheKey;
    order.origin = {orderID};

    if(order.errors) {
      console.warn("order", order.errors); /* eslint-disable-line no-console */
      get(listenerState).trigger("Error.append", responseToErrors({method: "POST", path, response}));
      return order;
    }

    if(order.completed) { cache.set(cacheKey, order); }

    return order;
  },
  key: "order/default/order"
});

const baseRecommendationQuery = selector({
  get: async({get}) => {
    const {benchmarkID, packageID, profileID} = get(baseState);
    const options = get(optionsState);
    const cacheOptions = {
      benchmarkID,
      packageID,
      profileID,
      type: "order-recommendation"
    };
    if(Object.hasOwn(options, "applyAssessmentExpiration")) {
      cacheOptions.applyAssessmentExpiration = options.applyAssessmentExpiration;
    }

    const cache = get(cacheState);
    const cacheKey = get(safeCacheKeyState(cacheOptions));
    const cached = cache.get(cacheKey);
    if(cached) { return cached; }

    const GraphQL = get(graphqlState);
    const http = get(httpState);
    const variables = {
      benchmarkID,
      localeKey: get(localeState),
      packageID,
      profileID
    };
    if(Object.hasOwn(options, "applyAssessmentExpiration")) {
      variables.applyAssessmentExpiration = options.applyAssessmentExpiration;
    }

    const params = {
      query: GraphQL.xavier.recommendation,
      variables
    };

    const {path} = GraphQL.xavier;
    const response = await http.post({path, params}).catch((e) => ({errors: [e.message]}));
    const order = orderFromRecommendation(response);
    order.cacheKey = cacheKey;
    order.origin = {benchmarkID, packageID, profileID};

    if(order.errors) {
      console.warn("order-recommendation", order.errors); /* eslint-disable-line no-console */
      get(listenerState).trigger("Error.append", responseToErrors({method: "POST", path, response}));
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
