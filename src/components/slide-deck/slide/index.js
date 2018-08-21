import {Component} from "preact";
import Markdown from "preact-markdown";
import style from "./style";

export default class Slide extends Component{
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
        <div key={slide.id} class={`${style.slide} ${style[slide.orientation]}`}>
          <img src={slide.image} alt={slide.alternative_text} />
        </div>
      );
    });

    if(showInstructions){
      activeSlides.unshift(
        <div key="instructions" class={`${style.slide} ${style.middle}`}>
          <div class={style.instructionsSlide}>
            <div class={style.instructionsText}>
              <Markdown markdown={instructions} />
            </div>
            <div class={style.instructionsStart}>
              <button class={style.instructionsButton} onClick={start}>
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
      <div class={style.container}>
        <div class={style.captionContainer} tabIndex="0">
          <div class={style.caption}>
            {currentSlide.caption}
          </div>
          <div class={style.progressContainer}>
            <div class={style.progress} style={{width: `${progress}%`}} />
          </div>
        </div>
        {activeSlides}
        {!showInstructions && (
          <div class={style.responseContainer}>
            <div class={style.buttons}>
              <button class={style.me} onClick={this.respondMe}>
                {translate("me")}
              </button>
              <button class={style.notMe} onClick={this.respondNotMe}>
                {translate("not_me")}
              </button>
            </div>
          </div>
        )}
        {allowBack && (
          <button class={style.back} onClick={back}>
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </button>
        )}
        {allowFullscreen && (
          <div class={[style.fullscreen, this.state.isFullscreen ? style.fullscreenSmall : ""].join(" ")} onClick={this.toggleFullscreen} />
        )}
      </div>
    );
  }
}
