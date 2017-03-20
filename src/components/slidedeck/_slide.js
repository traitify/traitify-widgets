import { h, Component } from "preact";
import style from "./_slide.scss";

export default class slideDeck extends Component {
  className (){
    if (window.Traitify.oldIE) return style.middleSlide;
    let position;
    if (this.props.slide.orientation == "invisible"){
      position = style.invisible;
    } else if (this.props.slide.orientation == "left"){
      position = style.leftSlide;
    } else if (this.props.slide.orientation == "middle"){
      position = style.middleSlide;
    } else {
      position = style.rightSlide;
    }

    return position;
  }
  style(){
    return {
      backgroundImage: `url(${this.props.slide.image})`,
      backgroundPosition: `${this.props.slide.focus_x}% ${this.props.slide.focus_y}%`
    };
  }
  render() {
    let tag;
    
    if (!window.Traitify.oldIE){
      tag = (
        <div class={`${style.slide} ${this.className()}`} style={this.style()} key={this.id} />
      );
    } else {
      tag = (
        <div class={`${style.slide} ${style.slideIE} ${this.className()}`}>
          <img src={this.props.slide.image} key={this.id} />
        </div>
      );
    }

    return tag;
  }
}
