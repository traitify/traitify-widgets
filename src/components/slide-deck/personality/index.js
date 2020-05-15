import PropTypes from "prop-types";
import {Component} from "react";
import {mutable} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {camelCase} from "lib/helpers/string";
import withTraitify from "lib/with-traitify";
import {
  completedSlides,
  dataChanged,
  getStateFromProps,
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

class Personality extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      id: PropTypes.string.isRequired,
      instructions: PropTypes.shape({instructional_text: PropTypes.string.isRequired}),
      locale_key: PropTypes.string.isRequired,
      scoring_scale: PropTypes.string,
      slides: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    assessmentID: PropTypes.string.isRequired,
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
  }
  constructor(props) {
    super(props);

    this.state = {
      isFullscreen: false,
      ...getStateFromProps(props)
    };
  }
  componentDidMount() {
    this.props.ui.trigger("SlideDeck.initialized", this);

    if(isFinished(this.state.slides)) {
      this.finish();
    } else if(this.state.slides.length > 0) {
      this.resizeImages();
    }

    window.addEventListener("resize", this.resizeImages);
    window.addEventListener("fullscreenchange", this.fullscreenToggled);
    window.addEventListener("webkitfullscreenchange", this.fullscreenToggled);
    window.addEventListener("mozfullscreenchange", this.fullscreenToggled);
    window.addEventListener("MSFullscreenChange", this.fullscreenToggled);
  }
  componentDidUpdate(prevProps) {
    this.props.ui.trigger("SlideDeck.updated", this);

    if(dataChanged(this.props.assessment, prevProps.assessment)) {
      this.setState(getStateFromProps(this.props), () => {
        if(isFinished(this.state.slides)) {
          this.finish();
        } else if(this.state.slides.length > 0) {
          this.resizeImages();
        }
      });
    }
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
  resizeImages = () => {
    this.setState((state, props) => {
      if(!this.container) { return; }

      const width = this.container.clientWidth;
      let height = this.container.clientHeight;
      const imageHost = props.getOption("imageHost");
      const isLikertScale = this.props.assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP";
      if(window.innerWidth <= 768 && isLikertScale) {
        height -= 74;
      }

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
  toggleFullscreen = () => {
    toggleFullscreen({current: this.state.isFullscreen, element: this.container});
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
    }, () => {
      const {assessmentID, cache} = this.props;

      cache.set(`slides.${assessmentID}`, completedSlides(this.state.slides));

      if(isFinished(this.state.slides)) { this.finish(); }
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
      const {assessmentID, cache} = this.props;

      cache.set(`slides.${assessmentID}`, completedSlides(this.state.slides));

      if(isFinished(this.state.slides)) { this.finish(); }
    });
  }
  finish() {
    if(this.state.finished) { return; }
    this.setState({finished: true});

    if(this.props.isReady("results")) { return; }

    this.props.traitify.put(
      `/assessments/${this.props.assessmentID}/slides`,
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
      <div className={style.widgetContainer} ref={(container) => { this.container = container; }}>
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
            instructions={this.state.instructions}
            isComplete={finished}
            isFullscreen={this.state.isFullscreen}
            isLikertScale={this.props.assessment.scoring_scale === "LIKERT_CUMULATIVE_POMP"}
            showInstructions={this.state.showInstructions}
            slideIndex={slideIndex(this.state.slides)}
            slides={this.state.slides}
            start={this.hideInstructions}
            toggleFullscreen={this.toggleFullscreen}
            translate={this.props.translate}
            updateLikertSlide={this.updateLikertSlide}
            updateSlide={this.updateSlide}
          />
        )}
      </div>
    );
  }
}

export {Personality as Component};
export default withTraitify(Personality);
