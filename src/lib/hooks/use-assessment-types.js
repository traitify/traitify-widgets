import unique from "lib/common/array/unique";
import useOrder from "lib/hooks/use-order";

export default function useAssessmentTypes({assessment} = {}) {
  const order = useOrder();
  const assessments = assessment ? [assessment] : order?.assessments || [];

  return {
    cognitive: assessments.some(({surveyType}) => surveyType === "cognitive"),
    personality: assessments.some(({surveyType}) => surveyType === "personality"),
    vendors: unique(assessments.map(({vendor}) => vendor).filter(Boolean))
  };
}
