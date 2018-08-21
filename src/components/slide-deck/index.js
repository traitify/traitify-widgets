import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import Loading from "./loading";
import Slide from "./slide";
import style from "./style.scss";

class SlideDeck extends Component{
  constructor(props){
    super(props);

    this.state = {
      finished: false,
      imageLoading: false,
      imageLoadAttempts: [],
      initialized: false,
      ready: false,
      slides: [],
      showInstructions: true
    };
  }
  componentDidMount(){
    this.props.traitify.ui.trigger("SlideDeck.initialized", this);
    this.initialize();
    window.addEventListener("resize", this.resizeImages);
  }
  componentDidUpdate(prevProps){
    if(!this.state.initialized){ return this.initialize(); }
    if(this.props.assessment.locale_key !== prevProps.assessment.locale_key){
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
  componentWillUnmount(){
    window.removeEventListener("resize", this.resizeImages);
  }
  initialize(){
    if(this.state.initialized){ return; }
    if(!this.props.assessment){ return; }
    if((this.props.assessment.slides || []).length === 0){ return; }

    this.setState((prevState, props)=>{
      if(prevState.initialized){ return; }

      const {assessment, assessmentID, cache} = props;
      let slides = [...assessment.slides] || [];
      let storedSlides = cache.get(`slides.${assessmentID}`) || [];
      let completedSlides = {};

      storedSlides.forEach((slide)=>{ completedSlides[slide.id] = slide; });

      slides.forEach((slide, index)=>{
        let completedSlide = completedSlides[slide.id];
        if(completedSlide){
          slide.response = completedSlide.response;
          slide.time_taken = completedSlide.time_taken;
        }
      });

      return {initialized: true, slides, startTime: Date.now()};
    }, ()=>{
      if(this.isComplete()){
        this.finish();
      }else{
        this.resizeImages();
      }
    });
  }
  fetchImages = ()=>{
    if(this.state.imageLoading){ return; }

    const currentIndex = this.currentIndex();
    const slideIndex = this.state.slides.findIndex((slide, index)=>(
      index >= currentIndex && !slide.loaded && slide.response == null
    ));
    if(slideIndex === -1){ return; }
    if(this.state.imageLoadAttempts[slideIndex] >= 30){ return; }

    this.setState({imageLoading: true}, ()=>{
      const slide = this.state.slides[slideIndex];
      let img = document.createElement("img");
      img.src = slide.image;
      img.onload = ()=>{
        let slides = this.slides();
        slides[slideIndex].loaded = true;
        this.setState({imageLoading: false, slides}, this.fetchImages);
      };
      img.onerror = ()=>{
        let attempts = [...this.state.imageLoadAttempts];
        attempts[slideIndex] = attempts[slideIndex] || 0;
        attempts[slideIndex] += 1;
        this.setState({imageLoading: false, imageLoadAttempts: attempts}, ()=>{
          setTimeout(this.fetchImages, 2000);
        });
      };
    });
  }
  update(prevProps){
    let loaded = this.state.slides.filter((slide)=>(slide.loaded)).length;
    let remainingSlidesLoaded = !this.state.slides.find((slide)=>(!slide.loaded && slide.response == null));
    let nextSlidesLoaded = loaded >= this.currentIndex() + 2;
    let ready = remainingSlidesLoaded || nextSlidesLoaded;

    if(this.state.ready === ready){ return; }
    this.props.traitify.ui.trigger("SlideDeck.isReady", this, ready);
    this.setState({ready, startTime: Date.now()});
  }
  slides(){
    return this.state.slides.map((slide)=>({...slide}));
  }
  currentIndex(){
    return this.state.slides.findIndex((slide)=>(slide.response == null));
  }
  resizeImages = ()=>{
    if(!this.container){ return; }
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const slides = this.slides();
    const imageHost = this.props.getOption("imageHost");

    slides.forEach((slide)=>{
      slide.loaded = false;
      slide.image = width > 0 && height > 0
        ? `${imageHost}/v1/images/${slide.id}?width=${width}&height=${height}`
        : slide.image_desktop;
    });

    this.setState({imageLoadAttempts: [], slides}, this.fetchImages);
  }
  finish(){
    if(this.state.finished){ return; }
    this.setState({finished: true});

    if(this.props.isReady("results")){ return; }

    this.props.traitify.put(`/assessments/${this.props.assessmentID}/slides`, this.completedSlides()).then((response)=>{
      this.props.traitify.ui.trigger("SlideDeck.finished", this, response);
      this.props.getAssessment({force: true});
    });
  }
  completedSlides(){
    return this.state.slides.filter((slide)=>(
      slide.response != null
    )).map((slide)=>({
      id: slide.id,
      response: slide.response,
      time_taken: slide.time_taken || 12345
    }));
  }
  isComplete(){
    return this.state.slides.length > 0 && this.state.slides.length === this.completedSlides().length;
  }
  // Event Methods
  back = ()=>{
    let slides = this.slides();
    slides[this.currentIndex() - 1].response = null;
    this.setState({slides, startTime: Date.now()}, this.fetchImages);
  }
  hideInstructions = ()=>{
    this.setState({showInstructions: false});
  }
  retry = ()=>{
    let attempts = this.state.imageLoadAttempts;
    attempts[attempts.length - 1] = 0;
    this.setState({imageLoadAttempts: attempts}, this.fetchImages);
  }
  updateSlide = (value)=>{
    let key = value ? "me" : "notMe";
    this.props.traitify.ui.trigger(`SlideDeck.${key}`, this);
    this.props.traitify.ui.trigger("SlideDeck.updateSlide", this);

    let slides = this.slides();
    let index = this.currentIndex();
    let slide = slides[index];
    slide.response = value;
    slide.time_taken = Date.now() - this.state.startTime;
    this.setState({slides}, ()=>{
      const {assessmentID, cache} = this.props;

      cache.set(`slides.${assessmentID}`, this.completedSlides());

      if(this.isComplete()){
        this.finish();
      }else{
        this.setState({startTime: Date.now()});
      }
    });
  }
  render(){
    if(this.props.isReady("results")){ return; }

    const isComplete = this.isComplete();

    return (
      <div class={style.widgetContainer} ref={(container)=>{ this.container = container; }}>
        {(isComplete || !this.state.ready) ? (
          <Loading imageLoadAttempts={this.state.imageLoadAttempts} retry={this.retry} />
        ):(
          <Slide
            back={this.back}
            container={this.container}
            currentIndex={this.currentIndex()}
            getOption={this.props.getOption}
            isComplete={isComplete}
            showInstructions={this.state.showInstructions}
            slides={this.state.slides}
            start={this.hideInstructions}
            traitify={this.props.traitify}
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
