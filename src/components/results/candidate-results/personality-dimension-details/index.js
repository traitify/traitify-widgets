import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

class PersonalityDimensionDetails extends Component {
  static propTypes = {
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
    this.props.ui.trigger("PersonalityDimension.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimension.updated", this);
  }
  render() {
    const {translate, type: {personality_type: {badge, details, level, name}}} = this.props;
    const color = `#${badge.color_1}`;
    const benefits = details.filter(({title}) => (title === "Benefits")).map(({body}) => body);
    const options = {base: {details}, perspective: "firstPerson"};

    return (
      <li className={style.container} style={{background: rgba(color, 10), borderTop: `5px solid ${color}`}}>
        <div className={style.side}>
          <p className={style.icon}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </p>
        </div>
        <div className={style.content}>
          <h2>{name} <span style={{color}}>|</span> {level}</h2>
          <h3>{translate("candidate_heading_for_dimension", {level, name})}</h3>
          <p className={style.description}>{detailWithPerspective({...options, name: "short_description"})}</p>
        </div>
        <h3>{translate("candidate_heading_for_benefits", {level, name})}</h3>
        <ul className={style.benefits}>
          {benefits.map((benefit) => (
            <li key={benefit} style={{background: rgba(color, 50)}}>{benefit}</li>
          ))}
        </ul>
      </li>
    );
  }
}

export {PersonalityDimensionDetails as Component};
export default withTraitify(PersonalityDimensionDetails);
