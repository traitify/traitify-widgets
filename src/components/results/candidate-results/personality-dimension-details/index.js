import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Benefits from "./benefits";
import Pitfalls from "./pitfalls";
import style from "./style";

class PersonalityDimensionDetails extends Component {
  static propTypes = {
    getOption: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    type: PropTypes.shape({
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired,
          image_medium: PropTypes.string.isRequired
        }).isRequired,
        details: PropTypes.array.isRequired,
        level: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensionDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensionDetails.updated", this);
  }
  render() {
    const {translate, type: {personality_type: {badge, details, level, name}}} = this.props;
    const color = `#${badge.color_1}`;
    const benefits = details.filter(({title}) => (title === "Benefits")).map(({body}) => body);
    const pitfalls = details.filter(({title}) => (title === "Pitfalls")).map(({body}) => body);
    const perspective = this.props.getOption("perspective") || "firstPerson";
    const options = {base: {details}, perspective};
    const benefitsHeader = perspective === "firstPerson" ? translate("candidate_heading_for_benefits", {level, name}) : translate("potential_benefits");

    return (
      <li className={style.container} style={{background: rgba(color, 10), borderTop: `5px solid ${color}`, listStyle: "none"}}>
        <div className={style.side}>
          <p className={style.icon}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </p>
        </div>
        <div className={style.content}>
          <h2>{name} <span style={{color}}>|</span> {level}</h2>
          {perspective === "firstPerson" && (
            <h3>{translate("candidate_heading_for_dimension", {level, name})}</h3>
          )}
          <p className={style.description}>{detailWithPerspective({...options, name: "short_description"})}</p>
        </div>
        <Benefits benefits={benefits} badge={badge} header={benefitsHeader} />
        {perspective === "thirdPerson" && (
          <Pitfalls pitfalls={pitfalls} badge={badge} header={translate("room_for_growth_and_change")} />
        )}
      </li>
    );
  }
}

export {PersonalityDimensionDetails as Component};
export default withTraitify(PersonalityDimensionDetails);
