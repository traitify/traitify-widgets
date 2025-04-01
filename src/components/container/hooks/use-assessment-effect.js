import {useEffect} from "react";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import mutable from "lib/common/object/mutable";
import useListener from "lib/hooks/use-listener";
import {activeState, assessmentQuery} from "lib/recoil";

export default function useAssessmentEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const assessmentLoadable = useRecoilValueLoadable(assessmentQuery);
  const listener = useListener();

  // NOTE: Syncs state from assessment to active
  useEffect(() => {
    if(!active) { return; }

    const {contents, state} = assessmentLoadable;
    const assessment = state === "hasValue" ? contents : null;
    if(assessment && active.id !== assessment.id) { return; }

    const values = {
      completed: assessment ? !!(assessment.completed || assessment.completed_at) : false,
      link: assessment?.assessmentTakerUrl,
      loading: state === "loading",
      surveyID: assessment?.deck_id || assessment?.surveyId || assessment?.surveyKey,
      surveyName: assessment?.surveyName || assessment?.name
    };
    // NOTE: Prevent overriding with blanks when data comes from order
    ["link", "surveyID", "surveyName"].filter((key) => !values[key]).forEach((key) => {
      delete values[key];
    });
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
