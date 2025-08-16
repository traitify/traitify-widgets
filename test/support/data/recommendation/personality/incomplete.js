import personality from "support/data/assessment/personality/base";
import personalitySurvey from "support/data/survey/personality/big-five";

export default {
  id: null,
  prerequisites: {
    cognitive: null,
    external: [],
    personality: {
      assessmentId: personality.id,
      isSkipped: false,
      status: "INCOMPLETE",
      surveyId: personality.deck_id,
      surveyName: personalitySurvey.name
    }
  }
};
