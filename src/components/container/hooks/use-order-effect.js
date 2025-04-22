import {useEffect, useRef} from "react";
import {useRecoilState} from "recoil";
import useListener from "lib/hooks/use-listener";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeState, orderState} from "lib/recoil";

export default function useOrderEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const order = useLoadedValue(orderState);
  const listener = useListener();
  const completedAssessments = useRef([]);
  const completedOrders = useRef([]);

  // NOTE: Syncs state from order to active
  useEffect(() => {
    if(!order) { return; }
    if(order.assessments.length === 0) { return; }

    const loadedAssessments = order.assessments.filter(({loaded}) => loaded);
    if(!active) {
      const nextAssessment = loadedAssessments.find(({completed}) => !completed)
        || loadedAssessments[0];
      if(nextAssessment) { setActive({...nextAssessment}); }

      return;
    }

    // NOTE: Show personality results
    if(order.completed) {
      const nextAssessment = loadedAssessments.find(({surveyType}) => surveyType === "personality")
        || loadedAssessments[0];
      if(!nextAssessment) { return; }

      setActive({...nextAssessment});
      return;
    }

    const currentAssessment = loadedAssessments.find(({id}) => id === active.id);
    if(!currentAssessment) { return; }

    // NOTE: Start next assessment
    if(currentAssessment.completed) {
      const nextAssessment = loadedAssessments.find(({completed}) => !completed);
      if(!nextAssessment) { return; }

      setActive({...nextAssessment});
      return;
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
}
