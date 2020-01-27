import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import style from "../style";

export default function Pitfalls(props) {
  const {badge, pitfalls, header} = props;
  const color = `#${badge.color_1}`;

  return (
    <div>
      <h3>{header}</h3>
      <ul className={style.detailsGroup}>
        {pitfalls.map((pitfall) => (
          <li key={pitfall} style={{background: rgba(color, 50)}}>{pitfall}</li>
        ))}
      </ul>
    </div>
  );
}

Pitfalls.propTypes = {
  badge: PropTypes.shape({
    color_1: PropTypes.string.isRequired
  }).isRequired,
  pitfalls: PropTypes.arrayOf(PropTypes.object).isRequired,
  header: PropTypes.string.isRequired
};
