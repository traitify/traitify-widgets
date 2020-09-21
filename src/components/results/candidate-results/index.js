import {
  faThLarge,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import Guide from "components/results/guide";
import PersonalityArchetype from "components/results/personality/archetype/heading";
import PersonalityDimensions from "components/results/personality/dimension/list";
import PersonalityTips from "components/results/personality/archetype/tips";
import PersonalityTraits from "components/results/personality/trait/list";
import style from "./style.scss";

function CandidateResults(props) {
  const {getOption, translate} = props;
  let disabledComponents = getOption("disabledComponents") || [];
  const allowHeaders = getOption("allowHeaders");
  const thirdPerson = getOption("perspective") === "thirdPerson";
  if(!thirdPerson) { disabledComponents = [...disabledComponents, "PersonalityPitfalls"]; }

  return (
    <section>
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faUser} /> {translate("personality_type")}</p>
      )}
      <PersonalityArchetype {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_details")}</p>
      )}
      <PersonalityTips {...props} />
      {allowHeaders && (
        <p className={style.lessMarginBottom}><Icon icon={faThLarge} /> {translate("personality_advice")}</p>
      )}
      <PersonalityDimensions {...props} disabledComponents={disabledComponents} />
      {thirdPerson && (
        <div>
          {allowHeaders && (
            <p className={style.heading}><Icon icon={faThLarge} /> {translate("interview_guide_heading")}</p>
          )}
          <Guide {...props} />
        </div>
      )}
      {allowHeaders && (
        <p className={style.paddingTop}><Icon icon={faThLarge} /> {translate("personality_traits")}</p>
      )}
      <PersonalityTraits {...props} />
    </section>
  );
}

CandidateResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default withTraitify(CandidateResults);
