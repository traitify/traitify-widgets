import {Component} from "preact";
import style from "./style";

export default class Caption extends Component{
  componentDidUpdate(prevProps){
    if(prevProps.caption !== this.props.caption){ return; }

    const element = document.querySelector(`.${style.container}`);
    element && element.focus();
  }
  render(){
    const {caption, progress} = this.props;

    return (
      <div class={style.container} tabIndex="0">
        <div class={style.caption}>
          {caption}
        </div>
        <div class={style.progressContainer}>
          <div class={style.progress} style={{width: `${progress}%`}} />
        </div>
      </div>
    );
  }
}
