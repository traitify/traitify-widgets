import PropTypes from "prop-types";
import {detailWithPerspective} from "lib/helpers";
import {findCompetency} from "lib/helpers/combine-data";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityDimensionDetails(props) {
  const {
    getOption,
    element,
    followGuide,
    guide,
    translate,
    type: {personality_type: {badge, details, id, level, name}},
    ui
  } = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionDetails.initialized", {props, state}); });
  useDidMount(() => { followGuide(); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionDetails.updated", {props, state}); });

  const benefits = details.filter(({title}) => (title === "Benefits")).map(({body}) => body);
  const pitfalls = details.filter(({title}) => (title === "Pitfalls")).map(({body}) => body);
  const perspective = getOption("perspective") || "firstPerson";
  const options = {base: {details}, perspective};
  const benefitsHeader = perspective === "firstPerson" ? translate("dimension_heading_for_benefits", {level, name}) : translate("potential_benefits");
  const competency = findCompetency({guide, typeID: id});
  const disabledComponents = getOption("disabledComponents") || [];
  const disablePitfalls = disabledComponents.includes("PersonalityPitfalls");

  return (
    <div className={style.container} ref={element}>
      <div className={style.header}>
        <img alt={`${name} ${translate("badge")}`} src={badge.image_medium} />
        {competency && (
          <div className={style.name}>
            {competency.name}<span className={style.divider}> | </span>
          </div>
        )}
        <div className={style.name}>{name}</div>
      </div>
      {perspective === "firstPerson" && <div className={style.heading}>{translate("dimension_heading", {level, name})}</div>}
      <div className={style.p}>{detailWithPerspective({...options, name: "short_description"})}</div>
      <div className={style.heading}>{benefitsHeader}</div>
      <div className={style.details}>
        {benefits.map((detail) => <div key={detail}>{detail}</div>)}
      </div>
      {!disablePitfalls && (
        <>
          <div className={style.heading}>{translate("room_for_growth_and_change")}</div>
          <div className={style.details}>
            {pitfalls.map((detail) => <div key={detail}>{detail}</div>)}
          </div>
        </>
      )}
    </div>
  );
}

PersonalityDimensionDetails.defaultProps = {element: null, guide: null};
PersonalityDimensionDetails.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
  followGuide: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  guide: PropTypes.shape({
    assessment_id: PropTypes.string.isRequired,
    competencies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,
    locale_key: PropTypes.string.isRequired
  }),
  translate: PropTypes.func.isRequired,
  type: PropTypes.shape({
    personality_type: PropTypes.shape({
      badge: PropTypes.shape({
        image_medium: PropTypes.string.isRequired
      }).isRequired,
      details: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }).isRequired
      ).isRequired,
      id: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionDetails as Component};
export default withTraitify(PersonalityDimensionDetails);
