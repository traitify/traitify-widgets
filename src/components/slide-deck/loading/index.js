import {Component} from "preact";
import style from "./style.scss";

export default class Loading extends Component{
  render(){
    const {imageLoadAttempts, retry, translate} = this.props;

    return (
      <div class={style.cover}>
        <div class={style.loading}>
          {imageLoadAttempts[imageLoadAttempts.length - 1] >= 10 ? (
            <div class={style.retry}>
              <div class={style.label}>{translate("slide_error")}</div>
              <button class={style.link} onClick={retry} type="button">
                {translate("try_again")}
              </button>
            </div>
          ):(
            <div class={style.symbol}>
              <i />
              <i />
            </div>
          )}
        </div>
      </div>
    );
  }
}
