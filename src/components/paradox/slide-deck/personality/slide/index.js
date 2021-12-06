import Markdown from "markdown-to-jsx";
import PropTypes from "prop-types";
import {useLayoutEffect, useRef} from "react";
import {camelCase} from "lib/helpers/string";
import style from "./style.scss";

function Image({orientation, slide}) {
  return (
    <div className={`${style.slide} ${style[orientation]}`}>
      <img src={slide.image} alt={slide.alternative_text} />
    </div>
  );
}

Image.propTypes = {
  orientation: PropTypes.string.isRequired,
  slide: PropTypes.shape({
    alternative_text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired
};

function Instructions({instructions, nextSlide, start, translate}) {
  return (
    <div className={style.container}>
      <div className={style.captionContainer}>
        <div className={style.caption}>{translate("instructions")}</div>
        <div className={style.progressContainer}>
          <div className={style.progress} style={{width: 0}} />
        </div>
      </div>
      <div className={`${style.slide} ${style.middle}`}>
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
        <Image key={nextSlide.id} orientation="right" slide={nextSlide} />
      </div>
    </div>
  );
}

Instructions.propTypes = {
  instructions: PropTypes.string.isRequired,
  nextSlide: PropTypes.shape({
    alternative_text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
  }).isRequired,
  start: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

function Slide({
  back,
  fullscreen,
  getOption,
  instructions,
  likertScale,
  showInstructions,
  slideIndex,
  slides,
  start,
  toggleFullscreen,
  translate,
  updateSlide
}) {
  const currentSlide = slides[slideIndex];
  const element = useRef(null);

  useLayoutEffect(() => {
    if(!element.current) { return; }

    element.current.focus();
  }, [showInstructions, slideIndex]);

  if(showInstructions) {
    return <Instructions {...{instructions, nextSlide: currentSlide, start, translate}} />;
  }

  const buttons = likertScale ? [
    {key: "really_not_me", response: "REALLY_NOT_ME"},
    {key: "not_me", response: "NOT_ME"},
    {key: "me", response: "ME"},
    {key: "really_me", response: "REALLY_ME"}
  ] : [
    {key: "me", response: true},
    {key: "not_me", response: false}
  ];
  const lastSlide = slides[slideIndex - 1];
  const nextSlide = slides[slideIndex + 1];

  return (
    <div className={[style.container, likertScale && style.likertScale].filter(Boolean).join(" ")}>
      <div className={style.captionContainer} ref={element} tabIndex="-1">
        <div className={style.caption}>{currentSlide.caption}</div>
        <div className={style.progressContainer}>
          <div className={style.progress} style={{width: `${(slideIndex / slides.length) * 100}%`}} />
        </div>
      </div>
      {lastSlide && <Image key={lastSlide.id} orientation="left" slide={lastSlide} />}
      <Image key={currentSlide.id} orientation="middle" slide={currentSlide} />
      {nextSlide && <Image key={nextSlide.id} orientation="right" slide={nextSlide} />}
      <div className={style.responseContainer}>
        <div className={style.buttons}>
          {buttons.map(({key, response}) => (
            <button
              key={key}
              className={["traitify--response-button", style.response, style[camelCase(key)]].join(" ")}
              onClick={() => updateSlide(slideIndex, response)}
              type="button"
            >
              {translate(key)}
            </button>
          ))}
        </div>
      </div>
      {getOption("allowBack") && slideIndex > 0 && (
        <button className={style.back} onClick={back} type="button">
          <img alt={translate("back")} src="https://cdn.traitify.com/assets/images/js/arrow_left.svg" />
        </button>
      )}
      {getOption("allowFullscreen") && (
        <button
          aria-label="fullscreen"
          className={[style.fullscreen, fullscreen ? style.fullscreenSmall : ""].join(" ")}
          onClick={toggleFullscreen}
          type="button"
        />
      )}
    </div>
  );
}

Slide.defaultProps = {instructions: null};
Slide.propTypes = {
  back: PropTypes.func.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  getOption: PropTypes.func.isRequired,
  instructions: PropTypes.string,
  likertScale: PropTypes.bool.isRequired,
  showInstructions: PropTypes.bool.isRequired,
  slideIndex: PropTypes.number.isRequired,
  slides: PropTypes.arrayOf(PropTypes.object).isRequired,
  start: PropTypes.func.isRequired,
  toggleFullscreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  updateSlide: PropTypes.func.isRequired
};

export default Slide;
