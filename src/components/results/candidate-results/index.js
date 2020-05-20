import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Guide from "components/results/guide";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityTraits from "components/results/personality/trait/list";

function CandidateResults(props) {
  return (
    <section>
      <PersonalityArchetype {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
      {props.getOption("perspective") === "thirdPerson" && <Guide {...props} />}
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  getOption: PropTypes.func.isRequired
};

export default withTraitify(CandidateResults);
