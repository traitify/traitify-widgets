import PropTypes from "prop-types";
import {Component} from "react";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import DetailsList from "./details-list";
import style from "./style";

class PersonalityDimensionDetails extends Component {
  static propTypes = {
    assessment: PropTypes.shape({
      personality_types: PropTypes.arrayOf(
        PropTypes.shape({
          personality_type: PropTypes.object
        })
      )
    }),
    getOption: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  static defaultProps = {
    assessment: null
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDimensionDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDimensionDetails.updated", this);
  }
  render() {
    if(!this.props.assessment) { return null; }
    const {translate} = this.props;

    const types = this.props.assessment.personality_types.sort((x, y) => {
      const xDetail = x.personality_type.details.find(({title}) => title === "Position") || {};
      const yDetail = y.personality_type.details.find(({title}) => title === "Position") || {};

      return (xDetail.body || 1) - (yDetail.body || 1);
    });

    const typesJsx = types.map((type) => {
      const {badge, details, id, level, name} = type.personality_type;
      const color = `#${badge.color_1}`;
      const perspective = this.props.getOption("perspective") || "firstPerson";
      const benefitsHeader = perspective === "firstPerson" ? translate("candidate_heading_for_benefits", {level, name}) : translate("potential_benefits");
      const options = {base: {details}, perspective};
      const benefits = details.filter(({title}) => (title === "Benefits")).map(({body}) => body);
      const pitfalls = details.filter(({title}) => (title === "Pitfalls")).map(({body}) => body);

      return (
        <li className={style.container} key={id} style={{background: rgba(color, 10), borderTop: `5px solid ${color}`, listStyle: "none"}}>
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
          <DetailsList detailsList={benefits} color={color} header={benefitsHeader} />
          {perspective === "thirdPerson" && (
            <DetailsList detailsList={pitfalls} color={color} header={translate("room_for_growth_and_change")} />
          )}
        </li>
      );
    });

    return (
      <div>
        {typesJsx}
      </div>
    );
  }
}

export {PersonalityDimensionDetails as Component};
export default withTraitify(PersonalityDimensionDetails);
