import Color from "color";
import PropTypes from "prop-types";
import getDetail from "lib/common/get-detail";
import getDetails from "lib/common/get-details";
import useOption from "lib/hooks/use-option";
import style from "./style.scss";

function FinancialRiskDimensionDetails({type}) {
  const {personality_type: {badge, details, level, name}} = type;
  const characteristics = getDetails({name: "Characteristics", personality: {details}});
  const perspective = useOption("perspective");
  if(characteristics.length === 0) { return null; }

  const color = Color(`#${badge.color_1}`);
  const headers = {
    Low: [
      `Those with lower ${name} will tend to be less willing to take on greater financial risk`,
      `Characteristics common in lower ${name}`
    ],
    Medium: [
      `Those with medium ${name} will tend to be less willing to take on greater financial risk`,
      `Characteristics common in medium ${name}`
    ],
    High: [
      `Those with higher ${name} will tend to be more willing to take on greater financial risk`,
      `Characteristics common in higher ${name}`
    ]
  }[level];
  const options = {personality: {details}, perspective};
  const containerStyle = {background: color.fade(0.9).string(), borderTop: `5px solid ${color.string()}`};
  const detailStyle = {background: color.fade(0.5).string()};

  return (
    <div className={style.container} style={containerStyle}>
      <div className={style.h1}>{name} <span style={{color: color.string()}}>|</span> {level}</div>
      <div className={style.h2}>{headers[0]}</div>
      <div className={style.p}>{getDetail({...options, name: "description"})}</div>
      <div className={style.h2}>{headers[1]}</div>
      <div className={style.characteristics}>
        {characteristics.map((characteristic) => (
          <div key={characteristic} style={detailStyle}>{characteristic}</div>
        ))}
      </div>
    </div>
  );
}

FinancialRiskDimensionDetails.propTypes = {
  type: PropTypes.shape({
    personality_type: PropTypes.shape({
      badge: PropTypes.shape({
        color_1: PropTypes.string.isRequired
      }).isRequired,
      details: PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        }).isRequired
      ).isRequired,
      level: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default FinancialRiskDimensionDetails;
