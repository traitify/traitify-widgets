import {h, Component} from "preact";
import Slide from "./slide";
import style from "./index.scss";

export default class SlideDeck extends Component{
  constructor(props){
    super(props);
    this.state = {
      finished: false,
      imageLoading: false,
      imageLoadAttempts: [],
      initialized: false,
      ready: false,
      slides: []
    };
  }
  componentDidMount(){
    this.initialize();
    window.addEventListener("resize", this.resizeImages);
  }
  componentDidUpdate(){
    this.state.initialized ? this.update() : this.initialize();
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

      let slides = [...props.assessment.slides] || [];
      let storedSlides = [];
      if(sessionStorage.getItem(`slides-${props.assessmentID}`)){
        try{
          storedSlides = JSON.parse(sessionStorage.getItem(`slides-${props.assessmentID}`));
        }catch(e){
          console.log(`StoredSlides JSON.parse error ${e}`);
        }
      }

      let completedSlides = {};
      (storedSlides || []).forEach((slide)=>{ completedSlides[slide.id] = slide; });

      slides.forEach((slide, index)=>{
        let completedSlide = completedSlides[slide.id];
        if(completedSlide){
          slide.response = completedSlide.response;
          slide.time_taken = completedSlide.time_taken;
        }
      });

      return {initialized: true, slides, startTime: Date.now()};
    }, ()=>{
      this.triggerCallback("initialized", this);
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
  update(){
    let loaded = this.state.slides.filter((slide)=>(slide.loaded)).length;
    let remainingSlidesLoaded = !this.state.slides.find((slide)=>(!slide.loaded && slide.response == null));
    let nextSlidesLoaded = loaded >= this.currentIndex() + 2;
    let ready = remainingSlidesLoaded || nextSlidesLoaded;

    if(this.state.ready === ready){ return; }
    this.triggerCallback("isReady", this, ready);
    this.setState({ready, startTime: Date.now()});
  }
  slides(){
    return this.state.slides.map((slide)=>({...slide}));
  }
  currentIndex(){
    return this.state.slides.findIndex((slide)=>(slide.response == null));
  }
  triggerCallback(key, context, options){
    this.props.triggerCallback("SlideDeck", key, context, options);
  }
  updateSlide(value){
    let key = value ? "me" : "notMe";
    this.triggerCallback(key, this);
    this.triggerCallback("updateSlide", this, value);

    let slides = this.slides();
    let index = this.currentIndex();
    let slide = slides[index];
    slide.response = value;
    slide.time_taken = Date.now() - this.state.startTime;
    this.setState({slides}, ()=>{
      try{
        sessionStorage.setItem(`slides-${this.props.assessmentID}`, JSON.stringify(this.completedSlides()));
      }catch(error){
        console.log(error);
      }

      if(this.isComplete()){
        this.finish();
      }else{
        this.setState({startTime: Date.now()});
      }
    });
  }
  resizeImages = ()=>{
    if(!this.container){ return; }
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const slides = this.slides();
    const imageHost = this.props.imageHost;

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
    if(this.props.resultsReady(this.props.assessment)) return;
    this.props.client.put(`/assessments/${this.props.assessmentID}/slides`, this.completedSlides()).then((response)=>{
      this.triggerCallback("finished", this, response);
      this.props.fetch();
    });
  }
  progress(){
    return this.isComplete() ? 100 : this.currentIndex() / this.state.slides.length * 100;
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
  respondMe = (e)=>{
    e.preventDefault();
    this.updateSlide(true);
  }
  respondNotMe = (e)=>{
    e.preventDefault();
    this.updateSlide(false);
  }
  retry = (e)=>{
    e.preventDefault();
    let attempts = this.state.imageLoadAttempts;
    attempts[attempts.length - 1] = 0;
    this.setState({imageLoadAttempts: attempts}, this.fetchImages);
  }
  toggleFullscreen = ()=>{
    const fullscreen = this.props.isFullscreen;

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
      if(this.container.requestFullscreen){
        this.container.requestFullscreen();
      }else if(this.container.webkitRequestFullscreen){
        this.container.webkitRequestFullscreen();
      }else if(this.container.mozRequestFullScreen){
        this.container.mozRequestFullScreen();
      }else if(this.container.msRequestFullscreen){
        this.container.msRequestFullscreen();
      }
    }
    this.props.setState({isFullscreen: !fullscreen});
    this.triggerCallback("fullscreen", this, !fullscreen);
  }
  render(){
    if(this.props.resultsReady(this.props.assessment)) return <span />;

    const currentIndex = this.currentIndex();
    const currentSlide = this.state.slides[currentIndex];
    const loading = this.isComplete() || !this.state.ready;
    const slides = this.state.slides;
    const activeSlides = [
      slides[currentIndex - 1] && {orientation: "left", ...slides[currentIndex - 1]},
      slides[currentIndex] && {orientation: "middle", ...slides[currentIndex]},
      slides[currentIndex + 1] && {orientation: "right", ...slides[currentIndex + 1]}
    ].filter((slide)=>slide);

    return (
      <div class={style.widgetContainer} ref={(container)=>{ this.container = container; }}>
        {loading ? (
          <div class={style.cover}>
            <div class={style.loading}>
              {this.state.imageLoadAttempts[this.state.imageLoadAttempts.length - 1] >= 30 ? (
                <div class={style.retry}>
                  <div class={style.label}>
                    Unable to load more slides at this time.
                  </div>
                  <a href="#" class={style.link} onClick={this.retry}>
                    Click Here to Try Again
                  </a>
                </div>
              ):(
                <div class={style.symbol}>
                  <i />
                  <i />
                </div>
              )}
            </div>
          </div>
        ):[
          <div key="slides" class={style.slideContainer}>
            <div class={style.captionContainer} tabIndex="0">
              <div class={style.caption}>
                {currentSlide.caption}
              </div>
              <div class={style.progressContainer}>
                <div class={style.progress} style={{width: `${this.progress()}%`}} />
              </div>
            </div>
            {activeSlides.map((slide)=>(
              <Slide key={slide.id} slide={slide} />
            ))}
          </div>,
          <div key="response" class={style.responseContainer}>
            <div class={style.buttons}>
              <a class={style.me} onClick={this.respondMe} href="#">
                {this.props.translate("me")}
              </a>
              <a class={style.notMe} onClick={this.respondNotMe} href="#">
                {this.props.translate("not_me")}
              </a>
            </div>
          </div>,
          this.props.allowBack && currentIndex > 0 && (
            <button key="back" class={style.back} onClick={this.back}>
              <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
            </button>
          ),
          this.props.allowFullscreen && (
            <div key="fullscreen" class={[style.fullscreen, this.props.isFullscreen ? style.fullscreenSmall : ""].join(" ")} onClick={this.toggleFullscreen} />
          )
        ]}
      </div>
    );
  }
}
