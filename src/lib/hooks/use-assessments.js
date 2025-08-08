import {useRecoilValue} from "recoil";
import {assessmentsState} from "lib/recoil";

// NOTE: Returns metadata for each assessment, not the assessment object
export default function useAssessments({surveyType} = {}) {
  const assessments = useRecoilValue(assessmentsState);
  if(!surveyType) { return assessments; }

  return assessments.filter(({surveyType: type}) => type === surveyType);
}
