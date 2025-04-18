import {useEffect} from "react";
import {useSetRecoilState, useRecoilState} from "recoil";
import mutable from "lib/common/object/mutable";
import useListener from "lib/hooks/use-listener";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeState, orderState} from "lib/recoil";

export default function useOrderEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const order = useLoadedValue(orderState);
  const setOrder = useSetRecoilState(orderState);
  const listener = useListener();

  // NOTE: Syncs state from active to order and sets next active
  useEffect(() => {
    if(!order) { return; }
    if(order.assessments.length === 0) { return; }

    const loadedAssessments = order.assessments.filter(({loaded}) => !loaded);
    if(!active) {
      const nextAssessment = loadedAssessments.find(({completed}) => !completed)
        || loadedAssessments[0];
      if(nextAssessment) { setActive({...nextAssessment}); }

      return;
    }

    // NOTE: Show personality results
    if(order.completed) {
      const nextAssessment = loadedAssessments[0];
      if(active.id === nextAssessment.id) { return; }

      setActive({...nextAssessment});
      return;
    }

    const updatedOrder = mutable(order);
    const currentAssessment = updatedOrder.assessments.find(({id}) => id === active.id);
    if(!currentAssessment) { return; }

    // NOTE: Start next assessment
    if(currentAssessment.completed) {
      const nextAssessment = order.assessments.find(({completed}) => !completed);
      if(!nextAssessment) { return; }

      setActive({...nextAssessment});
      return;
    }

    // NOTE: Sync active state changes to order
    let changes = ["completed"]
      .filter((key) => active[key] !== currentAssessment[key]);
    // TODO: Sync asseessment completed to order
  }, [active, order]);

  useEffect(() => {
    if(!order) { return; }
    if(!order.completed) { return; }

    listener.trigger("Surveys.finished", {assessments: order.assessments, order});
  }, [order]);
}
