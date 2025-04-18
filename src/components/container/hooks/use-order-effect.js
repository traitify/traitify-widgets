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

  /*
  useEffect(() => {
    if(!order) { return; }
    if(order.assessments.length === 0) { return; }

    order.assessments.forEach(({id, loaded, surveyType}) => {
      if(loaded) { return; }

      // TODO: Get assessment
      // - update in order - merge loaded: true
      // - update survey
    });
  }, [order]);
  */

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

    // TODO: Probably only need to sync completed
    // NOTE: Sync active state changes to order
    let changes = ["completed", "link", "surveyID", "surveyName"]
      .filter((key) => active[key] !== currentAssessment[key]);
    let set = false;

    if(changes.length > 0) {
      changes.forEach((key) => { currentAssessment[key] = active[key]; });

      updatedOrder.surveys.filter(({id}) => !id).forEach((survey) => {
        const assessment = updatedOrder.assessments
          .find(({surveyType}) => surveyType === survey.type);

        // eslint-disable-next-line no-param-reassign
        if(assessment?.surveyID) { survey.id = assessment.surveyID; }
      });

      set = true;
    }

    // NOTE: Update order completed and status
    if(updatedOrder.assessments.length === updatedOrder.surveys.length) {
      updatedOrder.completed = updatedOrder.assessments.every(({completed}) => completed);

      if(updatedOrder.completed && updatedOrder.status === "incomplete") {
        updatedOrder.status = "completed";
      }

      changes = ["completed", "status"].filter((key) => order[key] !== updatedOrder[key]);
      if(changes.length > 0) { set = true; }
    }

    // TODO: Update order status from loading? may go in useOrderPolling
    // - status - completed, error, loading, incomplete
    if(set) { setOrder(updatedOrder); }
  }, [active, order]);

  useEffect(() => {
    if(!order) { return; }
    if(!order.completed) { return; }

    listener.trigger("Surveys.finished", {assessments: order.assessments, order});
  }, [order]);
}
