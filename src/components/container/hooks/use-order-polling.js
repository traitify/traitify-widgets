import {useEffect, useMemo, useRef, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import dig from "lib/common/object/dig";
import mutable from "lib/common/object/mutable";
import orderFromQuery, {orderFromRecommendation} from "lib/common/order-from-query";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useInterval from "lib/hooks/use-interval";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useOrder from "lib/hooks/use-order";
import {localeState, orderState} from "lib/recoil";

const defaultPollingTimes = {
  long: {interval: 10 * 1000, stop: 10 * 24 * 60 * 60 * 1000},
  none: {interval: null, stop: null},
  short: {interval: 5 * 1000, stop: 1 * 60 * 1000}
};

const fetchLatestOrder = ({graphQL, http, localeKey, mode, origin}) => {
  switch(mode) {
    case "assessment":
      return http.post({
        params: {query: graphQL.external.get, variables: {id: origin.assessmentID}},
        path: graphQL.external.path,
        version: http.version === "v1" ? graphQL.external.version : undefined
      }).then((response) => {
        const assessment = dig(response, "data", "getAssessment");
        if(!assessment) { return null; }

        const completed = !!assessment.completedAt;
        return {
          assessments: [{completed, id: origin.assessmentID, surveyType: "external"}],
          completed,
          status: completed ? "completed" : "incomplete"
        };
      });
    case "order":
      return http.post(graphQL.order.path, {
        query: graphQL.order.get,
        variables: {id: origin.orderID}
      }).then(orderFromQuery);
    case "recommendation":
      return http.post(graphQL.xavier.path, {
        query: graphQL.xavier.recommendation,
        variables: {
          benchmarkID: origin.benchmarkID,
          localeKey,
          packageID: origin.packageID,
          profileID: origin.profileID
        }
      }).then(orderFromRecommendation);
    default:
      return Promise.resolve(null);
  }
};

const mergeOrder = (currentOrder, latestOrder) => {
  if(!latestOrder || latestOrder.errors) { return null; }

  let changes = false;
  const merged = mutable(currentOrder);

  latestOrder.assessments.forEach((latestAssessment) => {
    const currentAssessment = merged.assessments.find(({id}) => id === latestAssessment.id);
    if(currentAssessment && currentAssessment.completed !== latestAssessment.completed) {
      changes = true;
      currentAssessment.completed = currentAssessment.completed || latestAssessment.completed;
    } else if(!currentAssessment) {
      changes = true;
      merged.assessments.push(latestAssessment);
    }
  });

  if(merged.errors) {
    changes = true;
    merged.errors = undefined;
  }

  if(merged.completed !== latestOrder.completed) {
    changes = true;
    merged.completed = merged.assessments.every(({completed}) => completed);
    merged.status = merged.completed ? "completed" : latestOrder.status;
  } else if(merged.status !== latestOrder.status) {
    changes = true;
    merged.status = latestOrder.status;
  }

  return changes ? merged : null;
};

export default function useOrderPolling() {
  const localeKey = useRecoilValue(localeState);
  const graphQL = useGraphql();
  const [halted, setHalted] = useState(false);
  const http = useHttp();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const listener = useListener();
  const order = useOrder();
  const request = useRef(false);
  const setOrder = useSetRecoilState(orderState);
  const pollingTimes = useOption("order", "pollingTimes");
  const origin = order?.origin;
  const hasExternal = useMemo(() => (
    !!order?.assessments.some(({surveyType}) => surveyType === "external")
  ), [order]);
  const mode = useMemo(() => {
    if(!origin) { return null; }
    if(origin.orderID) { return "order"; }
    if(origin.profileID && (origin.benchmarkID || origin.packageID) && hasExternal) {
      return "recommendation";
    }
    if(origin.assessmentID && hasExternal) { return "assessment"; }
    return null;
  }, [origin, hasExternal]);
  const pollingTime = useMemo(() => {
    const times = mutable(defaultPollingTimes);

    pollingTimes && ["long", "short"].forEach((key) => {
      ["interval", "stop"].forEach((type) => {
        const time = dig(pollingTimes, key, type);
        if(time) { times[key][type] = time; }
      });
    });

    if(!order) { return times.none; }
    if(!mode) { return times.none; }
    if(order.completed) { return times.none; }
    if(order.status === "incomplete") { return times.long; }

    // NOTE: For status of error or loading
    return times.short;
  }, [mode, order?.status, pollingTimes]);

  useEffect(() => {
    if(!listener) { return; }

    return listener.on("Order.polling", ({status}) => {
      if(status !== "on") { return; }

      setHalted(false);
      setLastUpdatedAt(Date.now());
    });
  }, [listener]);

  useEffect(() => { setLastUpdatedAt(Date.now()); }, [order]);
  useEffect(() => {
    if(!listener) { return; }
    if(!halted) { return; }

    listener.trigger("Order.polling", {status: "off"});
  }, [halted, listener]);

  useInterval(() => {
    if(!order) { return; }
    if(!mode) { return; }
    if(halted) { return; }
    if(request.current) { return; }

    if(Date.now() - lastUpdatedAt > pollingTime.stop) {
      if(order.status === "loading") { setOrder({...order, status: "timeout"}); }

      setHalted(true);
      return;
    }

    request.current = true;

    fetchLatestOrder({graphQL, http, localeKey, mode, origin}).then((latestOrder) => {
      const merged = mergeOrder(order, latestOrder);
      if(merged) { setOrder(merged); }
    }).finally(() => { request.current = false; });
  }, halted ? null : pollingTime.interval);
}
