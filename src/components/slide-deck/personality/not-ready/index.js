import PropTypes from "prop-types";
import {Component} from "react";
import Loading from "components/loading";
import style from "./style.scss";

export default class NotReady extends Component {
  static defaultProps = {error: null}
  static propTypes = {
    error: PropTypes.string,
    retry: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired
  }
  render() {
    const {error, retry, translate} = this.props;

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
}
