import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import style from "../style";

export default function Benefits(props) {
  const {badge, benefits, header} = props;
  const color = `#${badge.color_1}`;

  return (
    <div>
      <h3>{header}</h3>
      <ul className={style.detailsGroup}>
        {benefits.map((benefit) => (
          <li key={benefit} style={{background: rgba(color, 50)}}>{benefit}</li>
        ))}
      </ul>
    </div>
  );
}

Benefits.propTypes = {
  badge: PropTypes.shape({
    color_1: PropTypes.string.isRequired
  }).isRequired,
  benefits: PropTypes.arrayOf(PropTypes.string).isRequired,
  header: PropTypes.string.isRequired
};
