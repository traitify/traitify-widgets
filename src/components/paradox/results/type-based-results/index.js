import PropTypes from "prop-types";
import PersonalityBase from "components/results/type-based-results/personality-base";
import PersonalityDetails from "components/results/type-based-results/personality-details";
import PersonalityTraits from "components/results/type-based-results/personality-traits";
import PersonalityTypes from "components/results/type-based-results/personality-types";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function TypeBasedResults({setElement, ...props}) {
  return (
    <section className={style.container} ref={setElement}>
      <PersonalityBase {...props} />
      <PersonalityTypes {...props} />
      <PersonalityTraits {...props} />
      <PersonalityDetails {...props} />
    </section>
  );
}

TypeBasedResults.propTypes = {
  setElement: PropTypes.func.isRequired
};

export {TypeBasedResults as Component};
export default withTraitify(TypeBasedResults);
