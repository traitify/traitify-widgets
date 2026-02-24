import profile from "support/data/profile";
import survey from "support/data/survey/external/default";

export default {
  assessmentTakerUrl: "https://external.traitify.com/external-assessment-id",
  band: "band-xyz",
  externalId: "external-id-xyz",
  externalSurveyKey: survey.key,
  id: "external-xyz",
  profileId: profile.id,
  signInUrl: "https://api.traitify.com/beta/assessments/external_assessments/sign_in/external-xyz?token=test-token",
  surveyKey: survey.key,
  surveyType: "EXTERNAL",
  surveyName: survey.name,
  vendor: survey.vendor
};
