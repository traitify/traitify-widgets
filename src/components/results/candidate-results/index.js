import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Guide from "components/results/guide";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityRecommendationChart from "components/results/personality/recommendation/chart";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityTraits from "components/results/personality/trait/list";

function CandidateResults(props) {
  if(props.getOption("perspective") === "thirdPerson") {
    return (
      <section>
        <PersonalityRecommendationChart {...props} />
        <Guide {...props} />
      </section>
    );
  }

  const disabledComponents = props.getOption("disabledComponents") || [];

  return (
    <section>
      <PersonalityArchetype {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} disabledComponents={[...disabledComponents, "PersonalityPitfalls"]} />
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  getOption: PropTypes.func.isRequired
};

export default withTraitify(CandidateResults);
