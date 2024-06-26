import PropTypes from "prop-types";
import style from "./style.scss";

function Loading({className: _class = null}) {
  const className = [_class, style.container].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <div className={style.loading}>
        <div />
        <div />
      </div>
    </div>
  );
}

Loading.propTypes = {className: PropTypes.string};

export default Loading;
