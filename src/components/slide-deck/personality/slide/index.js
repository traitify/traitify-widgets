import Markdown from "markdown-to-jsx";
import PropTypes from "prop-types";
import {Component} from "react";
import style from "./style.scss";

export default class Slide extends Component {
  static defaultProps = {instructions: null}
  static propTypes = {
    back: PropTypes.func.isRequired,
    getOption: PropTypes.func.isRequired,
    instructions: PropTypes.string,
    isComplete: PropTypes.bool.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    isLikertScale: PropTypes.bool.isRequired,
    showInstructions: PropTypes.bool.isRequired,
    slideIndex: PropTypes.number.isRequired,
    slides: PropTypes.arrayOf(PropTypes.object).isRequired,
    start: PropTypes.func.isRequired,
    toggleFullscreen: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    updateLikertSlide: PropTypes.func.isRequired,
    updateSlide: PropTypes.func.isRequired
  }
  componentDidUpdate(prevProps) {
    const instructionsChanged = prevProps.showInstructions !== this.props.showInstructions;
    const slideChanged = prevProps.slideIndex !== this.props.slideIndex;

    if(!instructionsChanged && !slideChanged) { return; }

    const element = document.querySelector(`.${style.captionContainer}`);
    element && element.focus();
  }
  respondLikertMe = () => { this.props.updateLikertSlide(this.props.slideIndex, "ME"); }
  respondLikertNotMe = () => { this.props.updateLikertSlide(this.props.slideIndex, "NOT_ME"); }
  respondLikertReallyMe = () => { this.props.updateLikertSlide(this.props.slideIndex, "REALLY_ME"); }
  respondLikertReallyNotMe = () => { this.props.updateLikertSlide(this.props.slideIndex, "REALLY_NOT_ME"); }
  respondMe = () => { this.props.updateSlide(this.props.slideIndex, true); }
  respondNotMe = () => { this.props.updateSlide(this.props.slideIndex, false); }
  render() {
    const {
      back,
      getOption,
      instructions,
      isComplete,
      isFullscreen,
      isLikertScale,
      showInstructions,
      slideIndex,
      slides,
      start,
      toggleFullscreen,
      translate
    } = this.props;
    const activeSlides = [];
    let allowBack;
    let allowFullscreen;
    let currentSlide;
    let progress;

    if(showInstructions) {
      activeSlides.push({orientation: "right", ...slides[slideIndex]});
    } else {
      if(slides[slideIndex - 1]) { activeSlides.push({orientation: "left", ...slides[slideIndex - 1]}); }
      activeSlides.push({orientation: "middle", ...slides[slideIndex]});
      if(slides[slideIndex + 1]) { activeSlides.push({orientation: "right", ...slides[slideIndex + 1]}); }
    }

    activeSlides.forEach((slide, index) => {
      activeSlides[index] = (
        <div key={slide.id} className={`${style.slide} ${style[slide.orientation]}`}>
          <img src={slide.image} alt={slide.alternative_text} />
        </div>
      );
    });

    if(showInstructions) {
      activeSlides.unshift(
        <div key="instructions" className={`${style.slide} ${style.middle}`}>
          <div className={style.instructionsSlide}>
            <div className={style.instructionsText}>
              <Markdown>{instructions || ""}</Markdown>
            </div>
            <div className={style.instructionsStart}>
              <button className={style.instructionsButton} onClick={start} type="button">
                {translate("get_started")}
                &rarr;
              </button>
            </div>
          </div>
        </div>
      );
      allowBack = false;
      allowFullscreen = false;
      currentSlide = {caption: translate("instructions")};
      progress = 0;
    } else {
      allowBack = getOption("allowBack") && slideIndex > 0;
      allowFullscreen = getOption("allowFullscreen");
      currentSlide = slides[slideIndex];
      progress = isComplete ? 100 : (slideIndex / slides.length) * 100;
    }

    const globalClass = "traitify--response-button";

    return (
      <div className={`${style.slideContainer} ${isLikertScale ? style.likertScale : ""}`}>
        <div className={style.captionContainer}>
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
            {isLikertScale ? (
              <div className={style.buttons}>
                <button className={`${globalClass} ${style.notMe} ${style.reallyNotMe}`} onClick={this.respondLikertReallyNotMe} type="button">
                  {translate("really_not_me")}
                </button>
                <button className={`${globalClass} ${style.notMe}`} onClick={this.respondLikertNotMe} type="button">
                  {translate("not_me")}
                </button>
                <button className={`${globalClass} ${style.me}`} onClick={this.respondLikertMe} type="button">
                  {translate("me")}
                </button>
                <button className={`${globalClass} ${style.me} ${style.reallyMe}`} onClick={this.respondLikertReallyMe} type="button">
                  {translate("really_me")}
                </button>
              </div>
            ) : (
              <div className={style.buttons}>
                <button className={`${globalClass} ${style.me}`} onClick={this.respondMe} type="button">
                  {translate("me")}
                </button>
                <button className={`${globalClass} ${style.notMe}`} onClick={this.respondNotMe} type="button">
                  {translate("not_me")}
                </button>
              </div>
            )}
          </div>
        )}
        {allowBack && (
          <button className={style.back} onClick={back} type="button">
            <img src="https://cdn.traitify.com/assets/images/js/arrow_left.svg" alt={translate("back")} />
          </button>
        )}
        {allowFullscreen && (
          <button aria-label="fullscreen" className={[style.fullscreen, isFullscreen ? style.fullscreenSmall : ""].join(" ")} onClick={toggleFullscreen} type="button" />
        )}
      </div>
    );
  }
}
