import {h, Component} from "preact";
import style from "./style";
import slideDeckStyle from "../index.scss";

export default class Slide extends Component{
  componentDidUpdate(prevProps){
    const middleSlide = this.props.slide.orientation === "middle";
    const orientationChanged = this.props.slide.orientation !== prevProps.slide.orientation;

    if(!middleSlide || !orientationChanged){ return; }
    const element = document.querySelector(`.${slideDeckStyle.captionContainer}`);
    element && element.focus();
  }
  render(){
    const slide = this.props.slide;

    return this.props.oldIE ? (
      <div class={`${style.slide} ${style.slideIE} ${style.middle}`}>
        <img src={slide.image} />
      </div>
    ) : (
      <div class={`${style.slide} ${style[slide.orientation]}`} style={{
        backgroundImage: `url(${slide.image})`,
        backgroundPosition: `${slide.focus_x}% ${slide.focus_y}%`
      }} />
    );
  }
}
