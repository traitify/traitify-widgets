import {useEffect, useMemo, useRef, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import dig from "lib/common/object/dig";
import mutable from "lib/common/object/mutable";
import orderFromQuery from "lib/common/order-from-query";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useInterval from "lib/hooks/use-interval";
import useListener from "lib/hooks/use-listener";
import useOption from "lib/hooks/use-option";
import useOrder from "lib/hooks/use-order";
import {orderIDState, orderState} from "lib/recoil";

const defaultPollingTimes = {
  long: {interval: 10 * 1000, stop: 5 * 60 * 1000},
  none: {interval: null, stop: null},
  short: {interval: 5 * 1000, stop: 1 * 60 * 1000}
};

export default function useOrderPolling() {
  const orderID = useRecoilValue(orderIDState);
  const graphQL = useGraphql();
  const [halted, setHalted] = useState(false);
  const http = useHttp();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const listener = useListener();
  const order = useOrder();
  const request = useRef(false);
  const setOrder = useSetRecoilState(orderState);
  const pollingTimes = useOption("order", "pollingTimes");
  const pollingTime = useMemo(() => {
    const times = mutable(defaultPollingTimes);

    pollingTimes && ["long", "short"].forEach((key) => {
      ["interval", "stop"].forEach((type) => {
        const time = dig(pollingTimes, key, type);
        if(time) { times[key][type] = time; }
      });
    });

    if(!order) { return times.none; }
    if(!orderID) { return times.none; }
    if(order.completed) { return times.none; }
    if(order.status === "incomplete") { return times.long; }

    // NOTE: For status of error or loading
    return times.short;
  }, [orderID, order?.status, pollingTimes]);

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
    if(!orderID) { return; }
    if(halted) { return; }
    if(request.current) { return; }

    if(Date.now() - lastUpdatedAt > pollingTime.stop) {
      if(order.status === "loading") { setOrder({...order, status: "timeout"}); }

      setHalted(true);
      return;
    }

    request.current = true;

    const params = {
      query: graphQL.order.get,
      variables: {id: orderID}
    };

    http.post(graphQL.order.path, params).then((response) => {
      let changes = false;
      const currentOrder = mutable(order);
      const latestOrder = orderFromQuery(response);

      latestOrder.assessments.forEach((latestAssessment) => {
        const currentAssessment = currentOrder.assessments
          .find(({id}) => id === latestAssessment.id);
        if(currentAssessment && currentAssessment.completed !== latestAssessment.completed) {
          // NOTE: May need to reset assessmentQuery for personality results
          changes = true;
          currentAssessment.completed = currentAssessment.completed || latestAssessment.completed;
        } else if(!currentAssessment) {
          changes = true;
          currentOrder.assessments.push(latestAssessment);
        }
      });

      if(currentOrder.completed !== latestOrder.completed) {
        changes = true;
        currentOrder.completed = currentOrder.assessments.every(({completed}) => completed);
        currentOrder.status = currentOrder.completed ? "completed" : latestOrder.status;
      }
      if(changes) { setOrder(currentOrder); }

      request.current = false;
    });
  }, halted ? null : pollingTime.interval);
}
