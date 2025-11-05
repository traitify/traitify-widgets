import PropTypes from "prop-types";
import style from "./style.scss";

function Divider({className = null}) {
  return <div className={[style.divider, className].filter(Boolean).join(" ")} />;
}

Divider.propTypes = {
  className: PropTypes.string
};

export default Divider;
