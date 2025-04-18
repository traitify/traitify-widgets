import {useEffect, useMemo, useRef, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import diff from "lib/common/deep-diff";
import orderFromQuery, {overrides} from "lib/common/order-from-query";
import useCache from "lib/hooks/use-cache";
import useCacheKey from "lib/hooks/use-cache-key";
import useGraphql from "lib/hooks/use-graphql";
import useHttp from "lib/hooks/use-http";
import useInterval from "lib/hooks/use-interval";
import useListener from "lib/hooks/use-listener";
import useOrder from "lib/hooks/use-order";
import {orderIDState, orderState} from "lib/recoil";

export default function useOrderPolling() {
  const orderID = useRecoilValue(orderIDState);
  const cache = useCache();
  const cacheKey = useCacheKey({id: orderID, type: "order"});
  const graphQL = useGraphql();
  const [halted, setHalted] = useState(false);
  const http = useHttp();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const listener = useListener();
  const order = useOrder();
  const request = useRef(false);
  const setOrder = useSetRecoilState(orderState);
  const pollingTime = useMemo(() => {
    // TODO: Make configurable
    const times = {
      long: {interval: 10 * 1000, stop: 5 * 60 * 1000},
      none: {interval: null, stop: null},
      shot: {interval: 5 * 1000, stop: 1 * 60 * 1000}
    };

    if(!order) { return times.none; }
    if(!orderID) { return times.none; }
    if(order.completed) { return times.none; }
    if(order.status === "incomplete") { return times.long; }

    // NOTE: For status of error, loading, or unknown
    return times.short;
  }, [orderID, order?.status]);

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
      setHalted(true);
      return;
    }

    request.current = true;

    const params = {
      query: graphQL.order.get,
      variables: {id: orderID}
    };
    // TODO: Remove overrides when API is ready
    const overrideState = localStorage.getItem("order-override");
    if(overrideState) { params.variables.id = overrides[overrideState]; }

    http.post(graphQL.order.path, params).then((response) => {
      const latestOrder = orderFromQuery(response);
      // TODO: Merge updates into order
      // - link and stuff too
      console.log("diff", diff.map(order, latestOrder));
      if(latestOrder.completed) { cache.set(cacheKey, latestOrder); }

      // TODO: Only set if there are changes
      setOrder(true ? order : latestOrder);

      request.current = false;
    });
  }, halted ? null : pollingTime.interval);
}
