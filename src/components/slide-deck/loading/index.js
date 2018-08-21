import {Component} from "preact";
import style from "./style.scss";

export default class Loading extends Component{
  render(){
    const {imageLoadAttempts, retry} = this.props;

    return (
      <div class={style.cover}>
        <div class={style.loading}>
          {imageLoadAttempts[imageLoadAttempts.length - 1] >= 10 ? (
            <div class={style.retry}>
              <div class={style.label}>
                Unable to load more slides at this time.
              </div>
              <button class={style.link} onClick={retry}>
                Click Here to Try Again
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
