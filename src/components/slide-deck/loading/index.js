import {Component} from "react";
import style from "./style.scss";

export default class Loading extends Component{
  render(){
    const {imageLoadAttempts, retry, translate} = this.props;

    return (
      <div className={style.cover}>
        <div className={style.loading}>
          {imageLoadAttempts[imageLoadAttempts.length - 1] >= 10 ? (
            <div className={style.retry}>
              <div className={style.label}>{translate("slide_error")}</div>
              <button className={style.link} onClick={retry} type="button">
                {translate("try_again")}
              </button>
            </div>
          ):(
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
