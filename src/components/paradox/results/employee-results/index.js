import PropTypes from "prop-types";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function EmployeeResults({element, ...props}) {
  return (
    <section className={style.container} ref={element}>
      <PersonalityArchetype {...props} />
      <PersonalitySkills {...props} />
      <PersonalityTips {...props} />
      <PersonalityDimensions {...props} />
    </section>
  );
}

EmployeeResults.defaultProps = {element: null};
EmployeeResults.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ])
};

export {EmployeeResults as Component};
export default withTraitify(EmployeeResults);
