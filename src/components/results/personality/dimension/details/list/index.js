import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import style from "../style";

export default function DetailsList(props) {
  const {color, detailsList, header} = props;

  return (
    <div className={style.detailsListContainer}>
      <h3>{header}</h3>
      <ul className={style.detailsList}>
        {detailsList.map((detail) => (
          <li key={detail} style={{background: rgba(color, 50)}}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}

DetailsList.propTypes = {
  detailsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  color: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired
};
