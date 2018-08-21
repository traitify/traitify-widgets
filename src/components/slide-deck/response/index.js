import {Component} from "preact";
import style from "./style";

export default class Response extends Component{
  render(){
    return (
      <div class={style.container}>
        <div class={style.buttons}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
