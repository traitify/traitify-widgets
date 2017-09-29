import {h, Component} from "preact";
import style from "./style";

export default class Slide extends Component{
  render(){
    if(this.props.client.oldIE){
      return (
        <div class={`${style.slide} ${style.slideIE} ${style.middleSlide}`}>
          <img src={this.props.slide.image} />
        </div>
      );
    }

    let className;
    if(this.props.slide.orientation === "invisible"){
      className = style.invisible;
    }else if(this.props.slide.orientation === "left"){
      className = style.leftSlide;
    }else if(this.props.slide.orientation === "middle"){
      className = style.middleSlide;
    }else{
      className = style.rightSlide;
    }

    let inlineStyle = {
      backgroundImage: `url(${this.props.slide.image})`,
      backgroundPosition: `${this.props.slide.focus_x}% ${this.props.slide.focus_y}%`
    };

    return (
      <div class={`${style.slide} ${className}`} style={inlineStyle} />
    );
  }
}
