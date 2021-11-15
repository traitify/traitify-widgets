import PropTypes from "prop-types";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function EmployeeResults({element, ...props}) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");

  return (
    <section className={style.container} ref={element}>
      {allowHeaders && <div className={style.heading}>{translate("personality_type")}</div>}
      <PersonalityArchetype {...props} />
      {allowHeaders && <div className={style.heading}>{translate("success_skills")}</div>}
      <PersonalitySkills {...props} />
      {allowHeaders && <div className={style.heading}>{translate("personality_tips")}</div>}
      <PersonalityTips {...props} />
      {allowHeaders && <div className={style.heading}>{translate("personality_breakdown")}</div>}
      <PersonalityDimensions {...props} />
    </section>
  );
}

EmployeeResults.defaultProps = {element: null};
EmployeeResults.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {EmployeeResults as Component};
export default withTraitify(EmployeeResults);
