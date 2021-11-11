import {
  faThLarge,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/employee-results";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalitySkills from "components/results/personality/archetype/skills";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityDimensions from "components/results/personality/dimension/list";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function EmployeeResults(props) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");

  return (
    <section>
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faUser} /> {translate("personality_type")}</p>
      )}
      <PersonalityArchetype {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("success_skills")}</p>
      )}
      <PersonalitySkills {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_tips")}</p>
      )}
      <PersonalityTips {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_breakdown")}</p>
      )}
      <PersonalityDimensions {...props} />
    </section>
  );
}

EmployeeResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {EmployeeResults as Component};
export default withTraitify(EmployeeResults, {paradox: Paradox});
