import PropTypes from "prop-types";
import {rgba} from "lib/helpers/color";
import style from "./style.scss";

function DetailsList(props) {
  const {color, details, header} = props;

  return (
    <div className={style.detailsListContainer}>
      <h3>{header}</h3>
      <ul className={style.detailsList}>
        {details.map((detail) => (
          <li key={detail} style={{background: rgba(color, 50)}}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}

DetailsList.propTypes = {
  color: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string).isRequired,
  header: PropTypes.string.isRequired
};

export default DetailsList;
