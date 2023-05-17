import {useEffect} from "react";
import {useRecoilState, useRecoilValueLoadable} from "recoil";
import useListener from "lib/hooks/use-listener";
import {activeState, assessmentQuery} from "lib/recoil";

export default function useAssessmentEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const assessmentLoadable = useRecoilValueLoadable(assessmentQuery);
  const listener = useListener();

  useEffect(() => {
    if(!active) { return; }

    const {contents, state} = assessmentLoadable;
    const assessment = state === "hasValue" ? contents : null;
    if(assessment && active.id !== assessment.id) { return; }

    const completed = assessment ? !!(assessment.completed || assessment.completed_at) : false;
    const loading = state === "loading";
    if(active.completed === completed && active.loading === loading) { return; }

    setActive({...active, completed, loading});
  }, [active, assessmentLoadable]);

  useEffect(() => {
    if(!active) { return; }
    if(!active.completed) { return; }

    listener.trigger("Survey.finished", {assessment: active});
  }, [active]);
}
