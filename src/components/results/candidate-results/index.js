import {
  faColumns,
  faThLarge,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/candidate-results";
import Guide from "components/results/guide";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityRecommendationChart from "components/results/personality/recommendation/chart";
import PersonalityTraits from "components/results/personality/trait/list";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function CandidateResults(props) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");
  const disabledComponents = getOption("disabledComponents") || [];

  if(getOption("perspective") === "thirdPerson") {
    return (
      <section>
        {allowHeaders && (
          <>
            <p className={style.heading}><Icon icon={faColumns} /> {translate("recommendation_chart_heading")}</p>
            <p>{translate("recommendation_chart_description")}</p>
          </>
        )}
        <PersonalityRecommendationChart {...props} />
        {allowHeaders && (
          <>
            <p className={style.heading}><Icon icon={faThLarge} /> {translate("interview_guide_heading")}</p>
            <p>{translate("interview_guide_description")}</p>
          </>
        )}
        <Guide {...props} />
      </section>
    );
  }

  return (
    <section>
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faUser} /> {translate("personality_type")}</p>
      )}
      <PersonalityArchetype {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_tips")}</p>
      )}
      <PersonalityTips {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_breakdown")}</p>
      )}
      <PersonalityDimensions {...props} disabledComponents={[...disabledComponents, "PersonalityPitfalls"]} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_traits")}</p>
      )}
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {CandidateResults as Component};
export default withTraitify(CandidateResults, {paradox: Paradox});
