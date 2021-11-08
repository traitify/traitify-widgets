import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Guide from "components/results/guide";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityRecommendationChart from "components/results/personality/recommendation/chart";
import PersonalityTraits from "components/results/personality/trait/list";
import style from "../style.scss";

function CandidateResults(props) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");
  const disabledComponents = getOption("disabledComponents") || [];

  if(getOption("perspective") === "thirdPerson") {
    return (
      <section className={[style.container, style.box].join(" ")}>
        {allowHeaders && (
          <>
            <div className={style.heading}>{translate("recommendation_chart_heading")}</div>
            <div>{translate("recommendation_chart_description")}</div>
          </>
        )}
        <PersonalityRecommendationChart combined={true} {...props} />
        <Guide combined={true} {...props} />
      </section>
    );
  }

  return (
    <section className={style.container}>
      {allowHeaders && <div className={style.heading}>{translate("personality_type")}</div>}
      <PersonalityArchetype {...props} />
      {allowHeaders && <div className={style.heading}>{translate("personality_details")}</div>}
      <PersonalityTips {...props} />
      {allowHeaders && <div className={style.heading}>{translate("personality_advice")}</div>}
      <PersonalityDimensions {...props} disabledComponents={[...disabledComponents, "PersonalityPitfalls"]} />
      {allowHeaders && <div className={style.heading}>{translate("personality_traits")}</div>}
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {CandidateResults as Component};
export default withTraitify(CandidateResults);
