import PropTypes from "prop-types";
import style from "./style.scss";

export default function Container({children, progress}) {
  return (
    <div className={`${style.container}`}>
      {progress < 100
        && (
        <div className={style.progressBar}>
          <div className={style.progress} style={{width: `${progress}%`}} />
        </div>
        )}
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  progress: PropTypes.number.isRequired
};
