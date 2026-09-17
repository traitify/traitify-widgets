import {useCallback} from "react";
import useAssessmentTypes from "lib/hooks/use-assessment-types";
import useTranslate from "lib/hooks/use-translate";

export default function useStatusTranslate({assessment} = {}) {
  const {cognitive, personality, vendors} = useAssessmentTypes({assessment});
  const interview = vendors.includes("crosschq");
  const translate = useTranslate();

  return useCallback((key, ...options) => {
    const keys = [
      personality && interview && "status.personality_interview",
      cognitive && interview && "status.cognitive_interview",
      interview && "status.interview",
      "status"
    ].filter(Boolean).map((prefix) => [prefix, key].join("."));

    return translate(keys, ...options);
  }, [cognitive, interview, personality, translate]);
}
