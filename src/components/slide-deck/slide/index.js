import Component from "components/traitify-component";
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

    return (
      <div class={`${style.slide} ${style[slide.orientation]}`}>
        <img src={slide.image} alt={slide.alternative_text} />
      </div>
    );
  }
}
