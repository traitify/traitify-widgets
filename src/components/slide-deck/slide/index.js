import {Component} from "preact";
import Caption from "../caption";
import Response from "../response";
import style from "./style";

export default class Slide extends Component{
  progress(){
    const {currentIndex, isComplete, slides} = this.props;

    return isComplete ? 100 : currentIndex / slides.length * 100;
  }
  respondMe = ()=>{ this.props.updateSlide(true); }
  respondNotMe = ()=>{ this.props.updateSlide(false); }
  toggleFullscreen = ()=>{
    const fullscreen = this.state.isFullscreen;

    if(fullscreen){
      if(document.exitFullscreen){
        document.exitFullscreen();
      }else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      }else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
      }else if(document.msExitFullscreen){
        document.msExitFullscreen();
      }
    }else{
      const {container} = this.props;

      if(container.requestFullscreen){
        container.requestFullscreen();
      }else if(container.webkitRequestFullscreen){
        container.webkitRequestFullscreen();
      }else if(container.mozRequestFullScreen){
        container.mozRequestFullScreen();
      }else if(container.msRequestFullscreen){
        container.msRequestFullscreen();
      }
    }
    this.setState({isFullscreen: !fullscreen});
    this.props.traitify.ui.trigger("SlideDeck.fullscreen", this, !fullscreen);
  }
  render(){
    const {
      back,
      currentIndex,
      getOption,
      slides,
      translate
    } = this.props;
    const currentSlide = slides[currentIndex];
    const activeSlides = [];

    if(slides[currentIndex - 1]){ activeSlides.push({orientation: "left", ...slides[currentIndex - 1]}); }
    if(slides[currentIndex]){ activeSlides.push({orientation: "middle", ...slides[currentIndex]}); }
    if(slides[currentIndex + 1]){ activeSlides.push({orientation: "right", ...slides[currentIndex + 1]}); }

    return (
      <div class={style.slideContainer}>
        <Caption caption={currentSlide.caption} progress={this.progress()} />
        {activeSlides.map((slide)=>(
          <div key={slide.id} class={`${style.slide} ${style[slide.orientation]}`}>
            <img src={slide.image} alt={slide.alternative_text} />
          </div>
        ))}
        <Response>
          <button class={style.me} onClick={this.respondMe}>
            {translate("me")}
          </button>
          <button class={style.notMe} onClick={this.respondNotMe}>
            {translate("not_me")}
          </button>
        </Response>
        {getOption("allowBack") && currentIndex > 0 && (
          <button class={style.back} onClick={back}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </button>
        )}
        {getOption("allowFullscreen") && (
          <div class={[style.fullscreen, this.state.isFullscreen ? style.fullscreenSmall : ""].join(" ")} onClick={this.toggleFullscreen} />
        )}
      </div>
    );
  }
}
