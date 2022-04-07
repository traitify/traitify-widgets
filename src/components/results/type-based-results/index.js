import {
  faThLarge,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/type-based-results";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import PersonalityBase from "./personality-base";
import PersonalityDetails from "./personality-details";
import PersonalityTraits from "./personality-traits";
import PersonalityTypes from "./personality-types";
import style from "../style.scss";

function TypeBasedResults(props) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");

  return (
    <section>
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faUser} /> {translate("personality_blend")}</p>
      )}
      <PersonalityBase {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_breakdown")}</p>
      )}
      <PersonalityTypes {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faUser} /> {translate("personality_traits")}</p>
      )}
      <PersonalityTraits {...props} />
      {allowHeaders && (
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_details")}</p>
      )}
      <PersonalityDetails {...props} />
    </section>
  );
}

TypeBasedResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default withTraitify(TypeBasedResults, {paradox: Paradox});
