import cognitive from "support/data/assessment/cognitive/base";
import external from "support/data/assessment/external/base";
import personality from "support/data/assessment/personality/base";
import organization from "support/data/organization";
import profile from "support/data/profile";

export default {
  id: "order-xyz",
  orgPath: organization.path,
  profileId: profile.id,
  requirements: {
    surveys: [
      {id: cognitive.surveyId, type: "COGNITIVE"},
      {id: external.surveyKey, type: "EXTERNAL"},
      {id: personality.deck_id, type: "PERSONALITY"}
    ]
  }
};
