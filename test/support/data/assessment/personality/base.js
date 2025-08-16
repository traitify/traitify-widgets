import locale from "support/data/locale";
import packageData from "support/data/package";
import profile from "support/data/profile";
import deck from "support/data/survey/personality/big-five";

export default {
  created_at: 1544219120952,
  id: "assessment-xyz",
  locale_key: locale.key,
  package_id: packageData.id,
  profile_ids: [profile.id],
  started_at: 1544219130254,
  // NOTE: Overriden in specific decks
  assessment_type: deck.assessment_type,
  deck_id: deck.id,
  scoring_scale: deck.scoring_scale
};
