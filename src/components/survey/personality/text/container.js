import PropTypes from "prop-types";
import Responses from "../responses";
import style from "../style.scss";

function Container({children, likert, onResponse, progress}) {
  return (
    <div className={[style.container, likert && style.likert].filter(Boolean).join(" ")}>
      <div className={style.progress} style={{width: `${progress}%`}} />
      <div className={style.image}>{children}</div>
      <Responses likert={likert} onResponse={onResponse} />
    </div>
  );
}

Container.defaultProps = {likert: false, onResponse: null};
Container.propTypes = {
  children: PropTypes.node.isRequired,
  likert: PropTypes.bool,
  onResponse: PropTypes.func,
  progress: PropTypes.number.isRequired
};

export default Container;
