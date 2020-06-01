import PropTypes from "prop-types";
import {detailWithPerspective} from "lib/helpers";
import {rgba} from "lib/helpers/color";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import List from "./list";
import style from "./style.scss";

function PersonalityDimensionDetails(props) {
  const {getOption, translate, type: {personality_type: {badge, details, level, name}}, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionDetails.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionDetails.updated", {props, state}); });

  const color = `#${badge.color_1}`;
  const benefits = details.filter(({title}) => (title === "Benefits")).map(({body}) => body);
  const pitfalls = details.filter(({title}) => (title === "Pitfalls")).map(({body}) => body);
  const perspective = getOption("perspective") || "firstPerson";
  const options = {base: {details}, perspective};
  const benefitsHeader = perspective === "firstPerson" ? translate("dimension_heading_for_benefits", {level, name}) : translate("potential_benefits");

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
          <h3>{translate("dimension_heading", {level, name})}</h3>
        )}
        <p className={style.description}>{detailWithPerspective({...options, name: "short_description"})}</p>
      </div>
      <List color={color} details={benefits} header={benefitsHeader} />
      {perspective === "thirdPerson" && (
        <List color={color} details={pitfalls} header={translate("room_for_growth_and_change")} />
      )}
    </li>
  );
}

PersonalityDimensionDetails.propTypes = {
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
};

export {PersonalityDimensionDetails as Component};
export default withTraitify(PersonalityDimensionDetails);
