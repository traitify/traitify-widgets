import { h, Component } from "preact";
import style from "./_slide.scss";

export default class slideDeck extends Component {
  className (){
    if(this.props.slide.orientation == "left"){
      return style.leftSlide;
    }else if(this.props.slide.orientation == "middle"){
      return style.middleSlide;
    }else{
      return style.rightSlide;
    }
  }
  style(){
    return {
      backgroundImage: `url(${this.props.slide.image_desktop_retina})`,
      backgroundPosition: `${this.props.slide.focus_x}% ${this.props.slide.focus_y}%`
    }
  }
  render() {
    return (
      <div class={`${style.slide} ${this.className()}`} style={this.style()} />
    )
  }
}
