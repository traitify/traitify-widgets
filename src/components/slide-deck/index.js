import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import {
  completedSlides,
  dataChanged,
  getStateFromProps,
  isFinished,
  isFullscreen,
  isReady,
  loadingIndex,
  mutable,
  slideIndex,
  toggleFullscreen
} from "./helpers";
import Loading from "./loading";
import Slide from "./slide";
import style from "./style.scss";

class SlideDeck extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
      id: PropTypes.string.isRequired,
      instructions: PropTypes.shape({instructional_text: PropTypes.string.isRequired}),
      locale_key: PropTypes.string.isRequired,
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
        this.setState((state) => (
          {imageLoading: false, imageLoadingAttempts: state.imageLoadingAttempts + 1}
        ), () => {
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
      const height = this.container.clientHeight;
      const imageHost = props.getOption("imageHost");
      const slides = state.slides.map((slide) => ({
        ...slide,
        loaded: false,
        image: width > 0 && height > 0
          ? `${imageHost}/slides/${slide.image_desktop_retina.split("/").pop()}?w=${width}&h=${height}&fp-x=${slide.focus_x / 100}&fp-y=${slide.focus_y / 100}&auto=compress&auto=format`
          : slide.image_desktop
      }));

      return {imageLoadingAttempts: 0, slides};
    }, this.fetchImages);
  }
  finish() {
    if(this.state.finished) { return; }
    this.setState({finished: true});

    if(this.props.isReady("results")) { return; }

    // TODO: If error, display it
    this.props.traitify.put(`/assessments/${this.props.assessmentID}/slides`, completedSlides(this.state.slides)).then((response) => {
      this.props.ui.trigger("SlideDeck.finished", this, response);
      this.props.getAssessment({force: true});
    });
  }
  // Event Methods
  back = () => {
    this.setState((state) => {
      const slides = mutable(state.slides);

      slides[slideIndex(slides) - 1].response = null;

      return {slides, startTime: Date.now()};
    }, this.fetchImages);
  }
  hideInstructions = () => {
    this.setState({showInstructions: false});
  }
  retry = () => {
    this.setState({imageLoadingAttempts: 0}, this.fetchImages);
  }
  toggleFullscreen = () => {
    toggleFullscreen({current: this.state.isFullscreen, element: this.container});
  }
  updateSlide = (index, value) => {
    this.setState((state) => {
      const key = value ? "me" : "notMe";
      this.props.ui.trigger(`SlideDeck.${key}`, this);
      this.props.ui.trigger("SlideDeck.updateSlide", this);

      const slides = mutable(state.slides);
      slides[index].response = value;
      slides[index].time_taken = Date.now() - state.startTime;

      return {slides, startTime: Date.now()};
    }, () => {
      const {assessmentID, cache} = this.props;

      cache.set(`slides.${assessmentID}`, completedSlides(this.state.slides));

      if(isFinished(this.state.slides)) { this.finish(); }
    });
  }
  render() {
    if(this.props.isReady("results")) { return null; }

    const finished = isFinished(this.state.slides);
    const ready = isReady(this.state.slides);

    return (
      <div className={style.widgetContainer} ref={(container) => { this.container = container; }}>
        {(finished || !ready) ? (
          <Loading
            imageLoading={this.state.imageLoadingAttempts < 3}
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
            showInstructions={this.state.showInstructions}
            slideIndex={slideIndex(this.state.slides)}
            slides={this.state.slides}
            start={this.hideInstructions}
            toggleFullscreen={this.toggleFullscreen}
            translate={this.props.translate}
            updateSlide={this.updateSlide}
          />
        )}
      </div>
    );
  }
}

export {SlideDeck as Component};
export default withTraitify(SlideDeck);
