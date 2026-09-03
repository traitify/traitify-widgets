import external from "support/data/assessment/external/completed";
import organization from "support/data/organization";
import profile from "support/data/profile";

export default {
  assessments: [
    {
      id: external.id,
      status: "COMPLETED",
      surveyId: external.surveyKey,
      type: "EXTERNAL"
    }
  ],
  id: "order-external-xyz",
  orgPath: organization.path,
  profileId: profile.id,
  requirements: {
    surveys: [{id: external.surveyKey, type: "EXTERNAL"}]
  },
  status: "COMPLETED"
};
