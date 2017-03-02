import { h, Component } from "preact";
import style from "./_slide.scss";

export default class slideDeck extends Component {
  className (){
    if(Traitify.oldIE){
      return style.middleSlide;
    }
    if(this.props.slide.orientation == "invisible"){
      return style.invisible;
    }else if(this.props.slide.orientation == "left"){
      return style.leftSlide;
    }else if(this.props.slide.orientation == "middle"){
      return style.middleSlide;
    }else{
      return style.rightSlide;
    }
  }
  style(){
    return {
      backgroundImage: `url(${this.props.slide.image})`,
      backgroundPosition: `${this.props.slide.focus_x}% ${this.props.slide.focus_y}%`
    }
  }

  render() {
    if(!Traitify.oldIE){
      return (
        <div class={`${style.slide} ${this.className()}`} style={this.style()} key={this.id} />
      )
    }else{
      return (
        <div class={`${style.slide} ${style.slideIE} ${this.className()}`}>
          <img src={this.props.slide.image} key={this.id} />
        </div>
      )
    }
  }
}
