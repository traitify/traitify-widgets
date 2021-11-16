import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import {mutable} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {camelCase} from "lib/helpers/string";
import withTraitify from "lib/with-traitify";
import {
  completedSlides,
  isFinished,
  isFullscreen,
  isReady,
  loadingIndex,
  slideIndex,
  toggleFullscreen
} from "./helpers";
import NotReady from "./not-ready";
import Slide from "./slide";
import style from "./style.scss";

function Personality({element, ...props}) {
  const {assessment, cache, getCacheKey, getOption, ui} = props;
  const [finishRequestAttempts, setFinishRequestAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadingAttempts, setImageLoadingAttempts] = useState(false);
  const [slides, setSlides] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const state = {
    finishRequestAttempts,
    finished,
    fullscreen,
    imageLoading,
    imageLoadingAttempts,
    slides,
    showInstructions
  };

  useDidMount(() => { ui.trigger("SlideDeck.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("SlideDeck.updated", {props, state}); });
  useEffect(() => {
    if(!dig(assessment, "slides")) { return; }

    const cachedData = cache.get(getCacheKey("slide-deck")) || {};
    const storedSlides = cachedData.slides || [];

    slides = mutable(assessment.slides).map((slide) => {
      const completedSlide = storedSlides.find(({id}) => id === slide.id);

      if(completedSlide) {
        slide.likert_response = completedSlide.likert_response;
        slide.response = completedSlide.response;
        slide.time_taken = completedSlide.time_taken;
      }

      return slide;
    });

    setSlides(slides);
    setStartTime(Date.now());

    if(getOption("allowInstructions") && assessment.instructions) {
      setInstructions(assessment.instructions.instructional_text);
      setShowInstructions(true);
    }
  }, [
    dig(assessment, "id"),
    dig(assessment, "locale_key"),
    dig(assessment, "instructions"),
    dig(assessment, "slides")
  ]);

  useEffect(() => {
    cache.set(getCacheKey("slide-deck"), {slides: completedSlides(slides)});

    if(isFinished(slides)) {
      this.finish();
    } else if(slides.length > 0) {
      this.resizeImages();
    }
  }, [slides]);

  componentDidMount() {
    window.addEventListener("resize", this.resizeImages);
    window.addEventListener("fullscreenchange", this.fullscreenToggled);
    window.addEventListener("webkitfullscreenchange", this.fullscreenToggled);
    window.addEventListener("mozfullscreenchange", this.fullscreenToggled);
    window.addEventListener("MSFullscreenChange", this.fullscreenToggled);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeImages);
    window.removeEventListener("fullscreenchange", this.fullscreenToggled);
    window.removeEventListener("webkitfullscreenchange", this.fullscreenToggled);
    window.removeEventListener("mozfullscreenchange", this.fullscreenToggled);
    window.removeEventListener("MSFullscreenChange", this.fullscreenToggled);
  }
  fetchImages = () => {
    if(this.state.imageLoading) { return; }

    const currentIndex = loadingIndex(this.state.slides);
    if(currentIndex === -1) { return; }
    if(this.state.imageLoadingAttempts >= 3) { return; }

    this.setState({imageLoading: true}, () => {
      const slide = this.state.slides[currentIndex];
      const img = document.createElement("img");
      img.src = slide.image;
      img.onload = () => {
        this.setState((state) => {
          const slides = mutable(state.slides);
          slides[currentIndex].loaded = true;

          return {
            imageLoading: false,
            imageLoadingAttempts: 0,
            slides
          };
        }, this.fetchImages);
      };
      img.onerror = () => {
        this.setState((state) => {
          const newState = {
            imageLoading: false,
            imageLoadingAttempts: state.imageLoadingAttempts + 1
          };

          if(newState.imageLoadingAttempts >= 3) {
            newState.error = this.props.translate("slide_error");
            newState.errorType = "image";
          }

          return newState;
        }, () => {
          setTimeout(this.fetchImages, 2000);
        });
      };
    });
  }
  fullscreenToggled = () => {
    this.setState({isFullscreen: isFullscreen()}, () => {
      this.props.ui.trigger("SlideDeck.fullscreen", this, this.state.isFullscreen);
      this.resizeImages();
    });
  }
  toggleFullscreen = () => {
    toggleFullscreen({current: this.state.isFullscreen, element: this.element.current});
  }
  resizeImages = () => {
    this.setState((state, props) => {
      if(!this.element.current) { return; }

      const width = this.element.current.clientWidth;
      let height = this.element.current.clientHeight;
      const imageHost = props.getOption("imageHost");
      const isLikertScale = this.props.assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP";
      if(window.innerWidth <= 768 && isLikertScale) { height -= 74; }

      const slides = state.slides.map((slide) => ({
        ...slide,
        loaded: false,
        image: width > 0 && height > 0
          ? `${imageHost}/slides/${slide.image_desktop_retina.split("/").pop()}?w=${width}&h=${height}&fp-x=${slide.focus_x / 100}&fp-y=${slide.focus_y / 100}&auto=format`
          : slide.image_desktop
      }));

      return {imageLoadingAttempts: 0, slides};
    }, this.fetchImages);
  }
  // Event Methods
  back = () => {
    this.setState((state) => {
      const slides = mutable(state.slides);
      const index = slideIndex(slides) - 1;

      delete slides[index].likert_response;
      delete slides[index].response;

      return {slides, startTime: Date.now()};
    }, this.fetchImages);
  }
  hideInstructions = () => {
    this.setState({showInstructions: false});
  }
  retry = () => {
    let callback;
    const newState = {error: null, errorType: null};

    if(this.state.errorType === "image") {
      callback = this.fetchImages;
      newState.imageLoadingAttempts = 0;
    } else {
      callback = this.finish;
      newState.finished = false;
    }

    this.setState(newState, callback);
  }
  updateLikertSlide = (index, value) => {
    this.setState((state) => {
      this.props.ui.trigger(`SlideDeck.likert.${camelCase(value)}`, this);
      this.props.ui.trigger("SlideDeck.updateSlide", this);

      const slides = mutable(state.slides);
      delete slides[index].response;
      slides[index].likert_response = value;
      slides[index].time_taken = Date.now() - state.startTime;

      return {slides, startTime: Date.now()};
    });
  }
  updateSlide = (index, value) => {
    this.setState((state) => {
      const key = value ? "me" : "notMe";
      this.props.ui.trigger(`SlideDeck.${key}`, this);
      this.props.ui.trigger("SlideDeck.updateSlide", this);

      const slides = mutable(state.slides);
      delete slides[index].likert_response;
      slides[index].response = value;
      slides[index].time_taken = Date.now() - state.startTime;

      return {slides, startTime: Date.now()};
    }, () => {
    });
  }
  finish() {
    if(this.state.finished) { return; }
    this.setState({finished: true});

    if(this.props.isReady("results")) { return; }

    this.props.traitify.put(
      `/assessments/${this.props.assessment.id}/slides`,
      completedSlides(this.state.slides)
    ).then((response) => {
      this.props.ui.trigger("SlideDeck.finished", this, response);
      this.props.getAssessment({force: true});
    }).catch((response) => {
      let error;

      try {
        error = JSON.parse(response).errors[0];
      } catch(e) {
        error = response;
      }

      const finishRequestAttempts = this.state.finishRequestAttempts + 1;

      if(finishRequestAttempts > 1) {
        this.setState({error, errorType: "request"});
      } else {
        this.setState({finished: false, finishRequestAttempts}, this.finish);
      }
    });
  }
  render() {
    if(this.props.isReady("results")) { return null; }

    const finished = isFinished(this.state.slides);
    const ready = isReady(this.state.slides);

    return (
      <div className={style.container} ref={element}>
        {(finished || !ready) ? (
          <NotReady
            error={this.state.error}
            retry={this.retry}
            translate={this.props.translate}
          />
        ) : (
          <Slide
            back={this.back}
            getOption={this.props.getOption}
            instructions={instructions}
            isComplete={finished}
            isFullscreen={fullscreen}
            isLikertScale={assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP"}
            showInstructions={this.state.showInstructions}
            slideIndex={slideIndex(this.state.slides)}
            slides={slides}
            start={this.hideInstructions}
            toggleFullscreen={this.toggleFullscreen}
            translate={translate}
            updateLikertSlide={this.updateLikertSlide}
            updateSlide={this.updateSlide}
          />
        )}
      </div>
    );
  }
}

Personality.defaultProps = {assessment: null};
Personality.propTypes = {
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    instructions: PropTypes.shape({instructional_text: PropTypes.string.isRequired}),
    locale_key: PropTypes.string.isRequired,
    scoring_scale: PropTypes.string,
    slides: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  cache: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired
  }).isRequired,
  getAssessment: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  traitify: TraitifyPropTypes.traitify.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Personality as Component};
export default withTraitify(Personality);
