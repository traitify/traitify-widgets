import PropTypes from "prop-types";
import style from "./style.scss";

export default function ProgressBar({progress}) {
  return (
    <div className={style.progressBar}>
      <div className={style.progress} style={{width: `${progress}%`}} />
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};
