import {useCallback} from "react";
import useOrder from "lib/hooks/use-order";
import useTranslate from "lib/hooks/use-translate";

export default function useStatusTranslate({assessment} = {}) {
  const order = useOrder();
  const translate = useTranslate();

  return useCallback((key, ...options) => {
    const assessments = assessment ? [assessment] : order?.assessments || [];
    const cognitive = assessments.some(({surveyType}) => surveyType === "cognitive");
    const personality = assessments.some(({surveyType}) => surveyType === "personality");
    const interview = assessments.some(({vendor}) => vendor === "crosschq");
    const keys = [
      personality && interview && "status.personality_interview",
      cognitive && interview && "status.cognitive_interview",
      interview && "status.interview",
      "status"
    ].filter(Boolean).map((prefix) => [prefix, key].join("."));

    return translate(keys, ...options);
  }, [assessment, order, translate]);
}
