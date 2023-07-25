import {useEffect} from "react";
import {useSetRecoilState, useRecoilState} from "recoil";
import useListener from "lib/hooks/use-listener";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeState, assessmentsState} from "lib/recoil";
import mutable from "lib/common/object/mutable";

export default function useAssessmentsEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const assessments = useLoadedValue(assessmentsState);
  const setAssessments = useSetRecoilState(assessmentsState);
  const listener = useListener();

  useEffect(() => {
    if(!assessments) { return; }
    if(assessments.length === 0) { return; }

    if(!active) {
      const nextAssessment = assessments.find(({completed}) => !completed) || assessments[0];

      setActive({...nextAssessment});
      return;
    }

    // NOTE: Show personality results
    if(assessments.every(({completed}) => completed)) {
      const nextAssessment = assessments[0];
      if(active.id === nextAssessment.id) { return; }

      setActive({...nextAssessment});
      return;
    }

    const updatedAssessments = mutable(assessments);
    const currentAssessment = updatedAssessments.find(({id}) => id === active.id);
    if(!currentAssessment) { return; }

    // NOTE: Start next assessment
    if(currentAssessment.completed) {
      const nextAssessment = assessments.find(({completed}) => !completed);
      if(!nextAssessment) { return; }

      setActive({...nextAssessment});
      return;
    }

    // NOTE: Sync active state changes to assessments
    const changes = {
      completed: active.completed !== currentAssessment.completed,
      name: active.name !== currentAssessment.name
    };

    if(changes.completed || changes.name) {
      if(changes.completed) { currentAssessment.completed = active.completed; }
      if(changes.name) { currentAssessment.name = active.name; }

      setAssessments(updatedAssessments);
    }
  }, [active, assessments]);

  useEffect(() => {
    if(!assessments) { return; }
    if(assessments.length === 0) { return; }
    if(assessments.some(({completed}) => !completed)) { return; }

    listener.trigger("Surveys.finished", {assessments});
  }, [assessments]);
}
