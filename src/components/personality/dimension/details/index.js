import PropTypes from "prop-types";
import {findCompetency} from "lib/common/combine-data";
import getDetails from "lib/common/get-details";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useInlineMemo from "lib/hooks/use-inline-memo";
import useGuide from "lib/hooks/use-guide";
import useOption from "lib/hooks/use-option";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

function PersonalityDimensionDetails({type}) {
  const disablePitfalls = useDisabledComponent("PersonalityPitfalls");
  const guide = useGuide();
  const translate = useTranslate();
  const perspective = useInlineMemo((value) => value || "firstPerson", [useOption("perspective")]);
  const {personality_type: {badge, details, id, level, name}} = type;

  useComponentEvents("PersonalityDimensionDetails");

  const personality = {details};
  const benefits = getDetails({name: "Benefits", personality});
  const pitfalls = getDetails({name: "Pitfalls", personality});
  const benefitsHeader = perspective === "firstPerson" ? translate("dimension_heading_for_benefits", {level, name}) : translate("potential_benefits");
  const competency = findCompetency({guide, typeID: id});

  return (
    <div className={style.container}>
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
      <div className={style.p}>{getDetails({name: "short_description", personality, perspective})}</div>
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

PersonalityDimensionDetails.propTypes = {
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
  }).isRequired
};

export default PersonalityDimensionDetails;
