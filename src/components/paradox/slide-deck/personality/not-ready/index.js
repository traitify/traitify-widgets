import PropTypes from "prop-types";
import Loading from "components/loading";
import style from "./style.scss";

function NotReady({error, retry, translate}) {
  return (
    <div className={style.cover}>
      <div className={style.loadingContainer}>
        {error ? (
          <div className={style.retry}>
            <div className={style.label}>{error}</div>
            <button className={style.link} onClick={retry} type="button">
              {translate("try_again")}
            </button>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

NotReady.defaultProps = {error: null};
NotReady.propTypes = {
  error: PropTypes.string,
  retry: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default NotReady;
