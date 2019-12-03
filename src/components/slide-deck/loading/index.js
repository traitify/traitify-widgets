import PropTypes from "prop-types";
import {Component} from "react";
import style from "./style.scss";

export default class Loading extends Component {
  static propTypes = {
    error: PropTypes.string,
    retry: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired
  }
  static defaultProps = {error: null}
  render() {
    const {error, retry, translate} = this.props;

    return (
      <div className={style.cover}>
        <div className={style.loading}>
          {error ? (
            <div className={style.retry}>
              <div className={style.label}>{error}</div>
              <button className={style.link} onClick={retry} type="button">
                {translate("try_again")}
              </button>
            </div>
          ) : (
            <div className={style.symbol}>
              <i />
              <i />
            </div>
          )}
        </div>
      </div>
    );
  }
}
