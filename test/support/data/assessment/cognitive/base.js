import locale from "support/data/locale";
import profile from "support/data/profile";
import survey from "support/data/survey/cognitive/default";

export default {
  id: "cognitive-xyz",
  localeKey: locale.key,
  name: survey.name,
  profileId: profile.id,
  surveyId: survey.id,
  surveyKey: survey.key
};
