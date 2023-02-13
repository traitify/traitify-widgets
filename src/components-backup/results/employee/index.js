import PropTypes from "prop-types";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function EmployeeResults({setElement, ...props}) {
  return (
    <section className={style.container} ref={setElement}>
      <PersonalityArchetype {...props} />
      <PersonalitySkills {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
    </section>
  );
}

EmployeeResults.propTypes = {
  setElement: PropTypes.func.isRequired
};

export {EmployeeResults as Component};
export default withTraitify(EmployeeResults);
