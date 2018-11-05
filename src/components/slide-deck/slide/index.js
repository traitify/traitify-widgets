import {Component} from "react";
import Markdown from "react-markdown";
import style from "./style";

export default class Slide extends Component{
  constructor(props){
    super(props);

    this.state = {isFullscreen: false};
  }
  componentDidUpdate(prevProps){
    const instructionsChanged = prevProps.showInstructions !== this.props.showInstructions;
    const slideChanged = prevProps.currentIndex !== this.props.currentIndex;

    if(!instructionsChanged && !slideChanged){ return; }

    const element = document.querySelector(`.${style.captionContainer}`);
    element && element.focus();
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
      instructions,
      isComplete,
      showInstructions,
      slides,
      start,
      translate
    } = this.props;
    const activeSlides = [];
    let allowBack, allowFullscreen, currentSlide, progress;

    if(showInstructions){
      activeSlides.push({orientation: "right", ...slides[currentIndex]});
    }else{
      if(slides[currentIndex - 1]){ activeSlides.push({orientation: "left", ...slides[currentIndex - 1]}); }
      activeSlides.push({orientation: "middle", ...slides[currentIndex]});
      if(slides[currentIndex + 1]){ activeSlides.push({orientation: "right", ...slides[currentIndex + 1]}); }
    }

    activeSlides.forEach((slide, index)=>{
      activeSlides[index] = (
        <div key={slide.id} className={`${style.slide} ${style[slide.orientation]}`}>
          <img src={slide.image} alt={slide.alternative_text} />
        </div>
      );
    });

    if(showInstructions){
      activeSlides.unshift(
        <div key="instructions" className={`${style.slide} ${style.middle}`}>
          <div className={style.instructionsSlide}>
            <div className={style.instructionsText}>
              <Markdown source={instructions} />
            </div>
            <div className={style.instructionsStart}>
              <button className={style.instructionsButton} onClick={start} type="button">
                {translate("get_started")} &rarr;
              </button>
            </div>
          </div>
        </div>
      );
      allowBack = false;
      allowFullscreen = false;
      currentSlide = {caption: translate("instructions")};
      progress = 0;
    }else{
      allowBack = getOption("allowBack") && currentIndex > 0;
      allowFullscreen = getOption("allowFullscreen");
      currentSlide = slides[currentIndex];
      progress = isComplete ? 100 : currentIndex / slides.length * 100;
    }

    return (
      <div className={style.slideContainer}>
        <div className={style.captionContainer} tabIndex="0">
          <div className={style.caption}>
            {currentSlide.caption}
          </div>
          <div className={style.progressContainer}>
            <div className={style.progress} style={{width: `${progress}%`}} />
          </div>
        </div>
        {activeSlides}
        {!showInstructions && (
          <div className={style.responseContainer}>
            <div className={style.buttons}>
              <button className={style.me} onClick={this.respondMe} type="button">
                {translate("me")}
              </button>
              <button className={style.notMe} onClick={this.respondNotMe} type="button">
                {translate("not_me")}
              </button>
            </div>
          </div>
        )}
        {allowBack && (
          <button className={style.back} onClick={back} type="button">
            <img src="https://cdn.traitify.com/assets/images/js/arrow_left.svg" alt={translate("back")} />
          </button>
        )}
        {allowFullscreen && (
          <div className={[style.fullscreen, this.state.isFullscreen ? style.fullscreenSmall : ""].join(" ")} onClick={this.toggleFullscreen} />
        )}
      </div>
    );
  }
}
