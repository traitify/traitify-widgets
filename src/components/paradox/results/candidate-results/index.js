import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityTraits from "components/results/personality/trait/list";
import style from "../style.scss";

function CandidateResults({setElement, ...props}) {
  return (
    <section className={style.container} ref={setElement}>
      <PersonalityArchetype {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  setElement: PropTypes.func.isRequired
};

export {CandidateResults as Component};
export default withTraitify(CandidateResults);
