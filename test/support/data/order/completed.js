import cognitive from "support/data/assessment/cognitive/completed";
import external from "support/data/assessment/external/completed";
import personality from "support/data/assessment/personality/completed";
import base from "./base";

export default {
  ...base,
  assessments: [
    {
      id: cognitive.id,
      status: "COMPLETED",
      surveyId: cognitive.surveyId,
      type: "COGNITIVE"
    },
    {
      id: external.id,
      status: "COMPLETED",
      surveyId: external.surveyKey,
      type: "EXTERNAL"
    },
    {
      id: personality.id,
      status: "COMPLETED",
      surveyId: personality.deck_id,
      type: "PERSONALITY"
    }
  ],
  status: "COMPLETED"
};
