import cognitive from "support/data/assessment/cognitive/base";
import external from "support/data/assessment/external/base";
import personality from "support/data/assessment/personality/base";
import personalitySurvey from "support/data/survey/personality/big-five";

export default {
  id: null,
  prerequisites: {
    cognitive: {
      isSkipped: false,
      status: "INCOMPLETE",
      surveyId: cognitive.surveyId,
      surveyName: cognitive.name,
      testId: cognitive.id
    },
    external: [{
      assessmentId: external.id,
      assessmentTakerUrl: external.assessmentTakerUrl,
      isSkipped: false,
      signInUrl: external.signInUrl,
      status: "INCOMPLETE",
      surveyId: external.surveyKey,
      surveyName: external.surveyName,
      vendor: external.vendor
    }],
    personality: {
      assessmentId: personality.id,
      isSkipped: false,
      status: "INCOMPLETE",
      surveyId: personality.deck_id,
      surveyName: personalitySurvey.name
    }
  }
};
