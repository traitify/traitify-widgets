import {useEffect} from "react";
import {useSetRecoilState, useRecoilState} from "recoil";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {activeState, assessmentsState} from "lib/recoil";
import mutable from "lib/common/object/mutable";
import slice from "lib/common/object/slice";

export default function useAssessmentsEffect() {
  const [active, setActive] = useRecoilState(activeState);
  const assessments = useLoadedValue(assessmentsState);
  const setAssessments = useSetRecoilState(assessmentsState);

  useEffect(() => {
    if(!assessments) { return; }
    if(assessments.length === 0) { return; }

    if(!active) {
      const nextAssessment = assessments.find(({completed}) => !completed) || assessments[0];

      setActive(slice(nextAssessment, ["completed", "id", "type"]));
      return;
    }

    // NOTE: Show personality results
    if(assessments.every(({completed}) => completed)) {
      const nextAssessment = assessments[0];
      if(active.id === nextAssessment.id) { return; }

      setActive(slice(nextAssessment, ["completed", "id", "type"]));
      return;
    }

    const updatedAssessments = mutable(assessments);
    const currentAssessment = updatedAssessments.find(({id}) => id === active.id);
    if(!currentAssessment) { return; }

    // NOTE: Start next assessment
    if(currentAssessment.completed) {
      const nextAssessment = assessments.find(({completed}) => !completed);
      if(!nextAssessment) { return; }

      setActive(slice(nextAssessment, ["completed", "id", "type"]));
      return;
    }

    // NOTE: Sync completed state to assessments
    if(active.completed !== currentAssessment.completed) {
      currentAssessment.completed = active.completed;

      setAssessments(updatedAssessments);
    }
  }, [active, assessments]);
}
