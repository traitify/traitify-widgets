import {useEffect, useMemo, useState} from "react";
import {useSetRecoilState} from "recoil";
import useInterval from "lib/hooks/use-interval";
import useListener from "lib/hooks/use-listener";
import useOrder from "lib/hooks/use-order";
import {orderState} from "lib/recoil";

// TODO: Make request
// TODO: Merge updates into order
// TODO: Make sure it only happens with an actual order from orderID
export default function useOrderPolling() {
  const [halted, setHalted] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const listener = useListener();
  const order = useOrder();
  const setOrder = useSetRecoilState(orderState);
  const pollingTime = useMemo(() => {
    const times = {
      long: {interval: 10 * 1000, stop: 5 * 60 * 1000},
      none: {interval: null, stop: null},
      shot: {interval: 5 * 1000, stop: 1 * 60 * 1000}
    };

    if(!order) { return times.none; }
    if(order.completed) { return times.none; }
    if(order.status === "incomplete") { return times.long; }

    // NOTE: For status of error, loading, or unknown
    return times.short;
  }, [order?.status]);

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
    if(halted) { return; }

    if(Date.now - lastUpdatedAt > pollingTime.stop) {
      setHalted(true);
      return;
    }
    console.log("Make request");
  }, halted ? null : pollingTime.interval);
}
