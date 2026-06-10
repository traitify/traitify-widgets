import {useEffect, useRef} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import getCacheKey from "lib/common/get-cache-key";
import useCache from "lib/hooks/use-cache";
import useListener from "lib/hooks/use-listener";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeState, baseState, localeState, orderState} from "lib/recoil";

export default function useOrderEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const [base, setBase] = useRecoilState(baseState);
  const order = useLoadedValue(orderState);
  const cache = useCache();
  const listener = useListener();
  const locale = useRecoilValue(localeState);
  const completedAssessments = useRef([]);
  const completedOrders = useRef([]);
  const wasIncomplete = useRef(false);

  // NOTE: Syncs profileID from order to base
  useEffect(() => {
    if(!order) { return; }
    if(base.profileID) { return; }
    if(order.assessments.length === 0) { return; }

    const profileID = order.assessments.find(({profileID: id}) => id)?.profileID;
    if(!profileID) { return; }

    setBase(({...base, profileID}));
  }, [order]);

  // NOTE: Syncs state from order to active
  useEffect(() => {
    if(!order) { return; }
    if(order.assessments.length === 0) { return; }

    if(!active) {
      const nextAssessment = order.assessments.find(({completed}) => !completed)
        || order.assessments[0];
      if(nextAssessment) { setActive({...nextAssessment}); }

      return;
    }

    // NOTE: Show personality results
    if(order.completed) {
      const nextAssessment = order.assessments.find(({surveyType}) => surveyType === "personality")
        || order.assessments[0];
      if(nextAssessment) { setActive({...nextAssessment}); }

      return;
    }

    const currentAssessment = order.assessments.find(({id}) => id === active.id);
    if(!currentAssessment) { return; }

    // NOTE: Start next assessment
    if(currentAssessment.completed) {
      const nextAssessment = order.assessments.find(({completed}) => !completed);
      if(nextAssessment) {
        setActive({...nextAssessment});

        return;
      }
    }

    // NOTE: Load updates for active assessment
    setActive({...currentAssessment});
  }, [order]);

  useEffect(() => {
    if(!active) { return; }
    if(!active.completed) { return; }
    if(completedAssessments.current.includes(active.id)) { return; }

    completedAssessments.current.push(active.id);
    listener.trigger("Survey.finished", {assessment: active});
  }, [active?.id, active?.completed]);

  useEffect(() => {
    if(!order) { return; }
    if(!order.completed) { return; }
    if(completedOrders.current.includes(order.cacheKey)) { return; }

    completedOrders.current.push(order.cacheKey);
    listener.trigger("Surveys.finished", {assessments: order.assessments, order});
  }, [order]);

  // NOTE: Clear assessment cache to grab newest recommendations next reload
  // - Sooner they may not be ready
  useEffect(() => {
    if(!order) { return; }
    if(!order.completed) {
      wasIncomplete.current = true;
      return;
    }
    if(!wasIncomplete.current) { return; }
    wasIncomplete.current = false;

    const personality = order.assessments.find(({surveyType}) => surveyType === "personality");
    if(!personality?.id) { return; }

    cache.remove(getCacheKey("assessment", {id: personality.id, locale}));
  }, [order]);
}
