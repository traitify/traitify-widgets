import cognitive from "support/data/assessment/cognitive/incomplete";
import external from "support/data/assessment/external/incomplete";
import personality from "support/data/assessment/personality/incomplete";
import base from "./base";

export default {
  ...base,
  assessments: [
    {
      id: cognitive.id,
      status: "INCOMPLETE",
      surveyId: cognitive.surveyId,
      type: "COGNITIVE"
    },
    {
      id: external.id,
      status: "INCOMPLETE",
      surveyId: external.surveyKey,
      type: "EXTERNAL"
    },
    {
      id: personality.id,
      status: "INCOMPLETE",
      surveyId: personality.deck_id,
      type: "PERSONALITY"
    }
  ],
  status: "ALL_ASSESSMENT_AVAILABLE"
};
