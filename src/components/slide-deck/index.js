import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Loading from "./loading";
import Slide from "./slide";
import style from "./style.scss";

const slideIndex = (slides) => (slides.findIndex((slide) => (slide.response == null)));
const mutable = (data) => (data.map((item) => ({...item})));

class SlideDeck extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({
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
      finished: false,
      imageLoading: false,
      imageLoadAttempts: [],
      initialized: false,
      isFullscreen: false,
      ready: false,
      slides: [],
      showInstructions: true
    };
  }
  componentDidMount() {
    this.props.ui.trigger("SlideDeck.initialized", this);
    this.initialize();
    window.addEventListener("resize", this.resizeImages);
  }
  componentDidUpdate(prevProps) {
    this.props.ui.trigger("Results.updated", this);

    if(!this.state.initialized) { return this.initialize(); }
    if(this.props.assessment.locale_key !== prevProps.assessment.locale_key) {
      return this.setState({
        finished: false,
        imageLoading: false,
        imageLoadAttempts: [],
        initialized: false,
        ready: false,
        slides: []
      });
    }

    this.update();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeImages);
  }
  initialize() {
    if(this.state.initialized) { return; }
    if(!this.props.assessment) { return; }
    if((this.props.assessment.slides || []).length === 0) { return; }

    this.setState((state, props) => {
      if(state.initialized) { return; }

      const {assessment, assessmentID, cache} = props;
      const storedSlides = cache.get(`slides.${assessmentID}`) || [];
      const completedSlides = {};

      storedSlides.forEach((slide) => { completedSlides[slide.id] = slide; });

      const slides = assessment.slides.map((_slide) => {
        const slide = {..._slide};
        const completedSlide = completedSlides[slide.id];
        if(completedSlide) {
          slide.response = completedSlide.response;
          slide.time_taken = completedSlide.time_taken;
        }

        return slide;
      });

      const newState = {slides, initialized: true, startTime: Date.now()};

      if(this.props.getOption("allowInstructions") && assessment.instructions) {
        newState.instructions = assessment.instructions.instructional_text;
        newState.showInstructions = true;
      } else {
        newState.showInstructions = false;
      }

      return newState;
    }, () => {
      if(this.isComplete()) {
        this.finish();
      } else {
        this.resizeImages();
      }
    });
  }
  fetchImages = () => {
    if(this.state.imageLoading) { return; }

    const currentIndex = slideIndex(this.state.slides);
    const loadingIndex = this.state.slides.findIndex((slide, index) => (
      index >= currentIndex && !slide.loaded && slide.response == null
    ));
    if(loadingIndex === -1) { return; }
    if(this.state.imageLoadAttempts[loadingIndex] >= 30) { return; }

    this.setState({imageLoading: true}, () => {
      const slide = this.state.slides[loadingIndex];
      const img = document.createElement("img");
      img.src = slide.image;
      img.onload = () => {
        this.setState((state) => {
          const slides = mutable(state.slides);
          slides[loadingIndex].loaded = true;

          return {imageLoading: false, slides};
        }, this.fetchImages);
      };
      img.onerror = () => {
        this.setState((state) => {
          const attempts = [...state.imageLoadAttempts];
          attempts[loadingIndex] = attempts[loadingIndex] || 0;
          attempts[loadingIndex] += 1;

          return {imageLoading: false, imageLoadAttempts: attempts};
        }, () => {
          setTimeout(this.fetchImages, 2000);
        });
      };
    });
  }
  update() {
    const loadedIndex = this.state.slides.filter((slide) => (slide.loaded)).length;
    const remainingSlidesLoaded = !this.state.slides.find(
      (slide) => (!slide.loaded && slide.response == null)
    );
    const nextSlidesLoaded = loadedIndex >= slideIndex(this.state.slides) + 2;
    const ready = remainingSlidesLoaded || nextSlidesLoaded;

    if(this.state.ready === ready) { return; }
    this.props.ui.trigger("SlideDeck.isReady", this, ready);
    this.setState({ready, startTime: Date.now()});
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
          ? `${imageHost}/v1/images/${slide.id}?width=${width}&height=${height}`
          : slide.image_desktop
      }));

      return {imageLoadAttempts: [], slides};
    }, this.fetchImages);
  }
  finish() {
    if(this.state.finished) { return; }
    this.setState({finished: true});

    if(this.props.isReady("results")) { return; }

    this.props.traitify.put(`/assessments/${this.props.assessmentID}/slides`, this.completedSlides()).then((response) => {
      this.props.ui.trigger("SlideDeck.finished", this, response);
      this.props.getAssessment({force: true});
    });
  }
  completedSlides() {
    return this.state.slides.filter((slide) => (
      slide.response != null
    )).map((slide) => ({
      id: slide.id,
      response: slide.response,
      time_taken: slide.time_taken >= 0 ? slide.time_taken : 2
    }));
  }
  isComplete() {
    const {slides} = this.state;

    return slides.length > 0 && slides.length === this.completedSlides().length;
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
    this.setState((state) => {
      const {imageLoadAttempts: attempts} = state;
      const imageLoadAttempts = [...attempts];

      imageLoadAttempts[attempts.length - 1] = 0;

      return {imageLoadAttempts: attempts};
    }, this.fetchImages);
  }
  toggleFullscreen = () => {
    this.setState((state) => {
      const {isFullscreen} = state;

      if(isFullscreen) {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        const {container} = this;

        if(container.requestFullscreen) {
          container.requestFullscreen();
        } else if(container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if(container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if(container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      }

      return {isFullscreen: !isFullscreen};
    }, () => {
      this.props.ui.trigger("SlideDeck.fullscreen", this, this.state.isFullscreen);
    });
  }
  updateSlide = (value) => {
    this.setState((state) => {
      const key = value ? "me" : "notMe";
      this.props.ui.trigger(`SlideDeck.${key}`, this);
      this.props.ui.trigger("SlideDeck.updateSlide", this);

      const slides = mutable(state.slides);
      const slide = slides[slideIndex(slides)];
      slide.response = value;
      slide.time_taken = Date.now() - state.startTime;

      return {slides};
    }, () => {
      const {assessmentID, cache} = this.props;

      cache.set(`slides.${assessmentID}`, this.completedSlides());

      if(this.isComplete()) {
        this.finish();
      } else {
        this.setState({startTime: Date.now()});
      }
    });
  }
  render() {
    if(this.props.isReady("results")) { return null; }

    const isComplete = this.isComplete();

    return (
      <div className={style.widgetContainer} ref={(container) => { this.container = container; }}>
        {(isComplete || !this.state.ready) ? (
          <Loading
            imageLoadAttempts={this.state.imageLoadAttempts}
            retry={this.retry}
            translate={this.props.translate}
          />
        ) : (
          <Slide
            back={this.back}
            getOption={this.props.getOption}
            instructions={this.state.instructions}
            isComplete={isComplete}
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
