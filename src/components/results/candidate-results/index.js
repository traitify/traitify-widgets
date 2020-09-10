import {
  faThLarge,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component} from "react";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import Guide from "../../guide";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensionDetails from "./personality-dimension-details";
import PersonalityDimensionColumns from "./personality-dimension-columns";
import PersonalityTraits from "../dimension-based-results/personality-traits";
import style from "./style";

class CandidateResults extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired
  }
  render() {
    const {getOption, translate} = this.props;
    const allowHeaders = getOption("allowHeaders");

    return (
      <section className={style.container}>
        {allowHeaders && (
          <p className={style.heading}><Icon icon={faUser} /> {translate("personality_type")}</p>
        )}
        <PersonalityArchetype {...this.props} />
        {allowHeaders && (
          <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_details")}</p>
        )}
        <PersonalityDimensionColumns {...this.props} />
        {getOption("perspective") === "thirdPerson" && (
          <div className={style.paddingBottom}>
            {allowHeaders && (
              <p className={style.heading}><Icon icon={faThLarge} /> {translate("interview_guide_heading")}</p>
            )}
            <Guide {...this.props} />
          </div>
        )}
        {allowHeaders && (
          <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_breakdown")}</p>
        )}
        <PersonalityDimensionDetails {...this.props} />
        <p className={style.lessMarginBottom}><Icon icon={faThLarge} /> {translate("personality_advice")}</p>
        <PersonalityDetails {...this.props} />
        <p className={style.paddingTop}><Icon icon={faThLarge} /> {translate("personality_traits")}</p>
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}

export default withTraitify(CandidateResults);
