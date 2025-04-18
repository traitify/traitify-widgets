import {useEffect} from "react";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import mutable from "lib/common/object/mutable";
import {assessmentFromQuery} from "lib/common/order-from-query";
import useListener from "lib/hooks/use-listener";
import {activeAssessmentQuery, orderState} from "lib/recoil";

export default function useAssessmentEffect() {
  const active = useRecoilValue(activeState);
  const assessmentLoadable = useRecoilValueLoadable(activeAssessmentQuery);
  const listener = useListener();
  const [order, setOrder] = useRecoilState(orderState);

  const ids = order ? order.assessments.map(({id}) => id) : [];

  useRecoilCallback(() => {

  }, [ids.join(" ")]);




















  // NOTE: Syncs state from assessment to order
  useEffect(() => {
    if(!active) { return; }
    if(!order) { return; }

    const latestOrder = mutable(_latestOrder);
    const assessment = latestOrder.assessments.find((a) => a.id === id);
    Object.assign(assessment, assessmentFromQuery(latestAssessment));

    const {contents, state} = assessmentLoadable;
    const assessment = state === "hasValue" ? contents : null;
    if(assessment && active.id !== assessment.id) { return; }

    const values = assessment ? assessmentFromQuery(assessment) : {loading: state === "loading"};
    const keys = Object.keys(values).filter((key) => active[key] !== values[key]);
    if(keys.length === 0) { return; }

    const changes = mutable(active);
    keys.forEach((key) => { changes[key] = values[key]; });

    setActive(changes);
  }, [active, assessmentLoadable]);

  useEffect(() => {
    if(!active) { return; }
    if(!active.completed) { return; }

    listener.trigger("Survey.finished", {assessment: active});
  }, [active?.id, active?.completed]);
}
