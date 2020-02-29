import {
  faThLarge
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import Icon from "lib/helpers/icon";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import Guide from "../../guide";
import style from "./style";
import PersonalityArchetype from "./personality-archetype";
import PersonalityDetails from "./personality-details";
import PersonalityDimensions from "./personality-dimensions";
import PersonalityTraits from "../dimension-based-results/personality-traits";

class CandidateResults extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired
  }
  render() {
    const {getOption, translate} = this.props;

    return (
      <section className={style.container}>
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_type")}</p>
        <PersonalityArchetype {...this.props} />
        <p className={style.heading}><Icon icon={faThLarge} /> {translate("personality_details")}</p>
        <PersonalityDimensions {...this.props} />
        <p className={style.lessBottomMargin}><Icon icon={faThLarge} /> {translate("personality_advice")}</p>
        <PersonalityDetails {...this.props} />
        {getOption("perspective") === "thirdPerson" && (
          <div>
            <p className={style.heading}><Icon icon={faThLarge} /> {translate("interview_guide_heading")}</p>
            <Guide {...this.props} />
          </div>
        )}
        <p className={style.topPadding}><Icon icon={faThLarge} /> {translate("personality_breakdown")}</p>
        <PersonalityTraits {...this.props} />
      </section>
    );
  }
}

export default withTraitify(CandidateResults);
