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
    const skipped = assessment?.skipped || false;
    const changes = {
      completed: active.completed !== completed,
      loading: active.loading !== loading,
      skipped: active.skipped !== skipped
    };
    if(!changes.completed && !changes.loading && !changes.skipped) { return; }

    setActive({...active, completed, loading, skipped});
  }, [active, assessmentLoadable]);

  useEffect(() => {
    if(!active) { return; }
    if(!active.completed && !active.skipped) { return; }

    listener.trigger("Survey.finished", {assessment: active});
  }, [active?.id, active?.completed]);
}
