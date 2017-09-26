import {h, Component} from "preact";
import Slide from "./slide";
import style from "./index.scss";

export default class SlideDeck extends Component{
  constructor(props){
    super(props);
    this.respondMe = this.respondMe.bind(this);
    this.respondNotMe = this.respondNotMe.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.retry = this.retry.bind(this);
    this.state = {
      finished: false,
      imageLoadAttempts: [],
      initialized: false,
      ready: false,
      slides: []
    };
  }
  componentDidMount(){
    this.initialize();
  }
  componentDidUpdate(){
    this.initialize();
  }
  initialize(){
    if(this.state.initialized){ return; }
    if(!this.props.assessment){ return; }
    if((this.props.assessment.slides || []).length === 0){ return; }

    this.setState((prevState, props)=>{
      if(prevState.initialized){ return; }

      let slides = props.assessment.slides || [];
      let storedSlides = [];
      if(sessionStorage.getItem(`slides-${props.assessmentId}`)){
        try{
          storedSlides = JSON.parse(sessionStorage.getItem(`slides-${props.assessmentId}`));
        }catch(e){
          console.log(`StoredSlides JSON.parse error ${e}`);
        }
      }

      let completedSlides = {};
      (storedSlides || []).forEach((slide)=>{ completedSlides[slide.id] = slide; });

      slides[0].orientation = "middle";
      slides[1].orientation = "right";
      slides.forEach((slide, index)=>{
        slide.image = this.imageService(slide);

        let completedSlide = completedSlides[slide.id];
        if(completedSlide){
          slide.response = completedSlide.response;
          slide.time_taken = completedSlide.time_taken;
        }

        if(slide.response != null){ this.setOrientation(index + 1, slides); }
      });

      return {initialized: true, slides, startTime: Date.now()};
    }, ()=>{
      this.triggerCallback("initialized", this);
      if(this.isComplete()){
        this.finish();
      }else{
        setTimeout(()=>{ this.prefetchSlides(this.currentIndex()); }, 0);
      }
    });
  }
  imageService(slide){
    return slide ? slide.image_desktop : null;
  }
  prefetchSlides(slideIndex){
    let slide = this.state.slides[slideIndex];
    if(!slide || !slide.image){ return; }

    let img = document.createElement("img");
    img.src = slide.image;
    img.onload = ()=>{
      let slides = this.state.slides;
      slides[slideIndex].loaded = true;
      this.setState({slides}, ()=>{
        this.triggerCallback("prefetchSlides", this);
        this.checkReady();
        this.prefetchSlides(slideIndex + 1);
      });
    };
    img.onerror = ()=>{
      let attempts = this.state.imageLoadAttempts;
      attempts[slideIndex] = attempts[slideIndex] || 0;
      attempts[slideIndex] += 1;
      this.setState({imageLoadAttempts: attempts}, ()=>{
        if(attempts[slideIndex] < 30){
          setTimeout(()=>{ this.prefetchSlides(slideIndex); }, 2000);
        }
      });
    };
  }
  checkReady(){
    let loaded = this.loadedSlides().length;
    let allSlidesLoaded = loaded === this.state.slides.length;
    let nextSlidesLoaded = loaded >= this.currentIndex() + 2;
    let ready = allSlidesLoaded || nextSlidesLoaded;

    if(this.state.ready === ready){ return; }
    this.triggerCallback("isReady", this, ready);
    this.setState({ready});
  }
  loadedSlides(){
    return this.state.slides.filter((slide)=>{ return slide.loaded; });
  }
  currentSlide(){
    return this.state.slides.find((slide)=>{ return slide.orientation === "middle"; }) || {};
  }
  currentIndex(){
    return this.state.slides.map((slide)=>{ return slide.id; }).indexOf(this.currentSlide().id);
  }
  triggerCallback(key, context, options){
    this.props.triggerCallback("SlideDeck", key, context, options);
  }
  respondMe(e){
    e.preventDefault();
    this.updateSlide(true);
  }
  respondNotMe(e){
    e.preventDefault();
    this.updateSlide(false);
  }
  updateSlide(value){
    let key = value ? "me" : "notMe";
    this.triggerCallback(key, this);
    this.triggerCallback("updateSlide", this, value);

    let slides = this.state.slides;
    let slide = this.currentSlide();
    slide.response = value;
    slide.time_taken = Date.now() - this.state.startTime;
    slides[this.currentIndex()] = slide;
    this.setState({slides}, ()=>{
      try{
        sessionStorage.setItem(`slides-${this.props.assessmentId}`, JSON.stringify(this.completedSlides()));
      }catch(error){
        console.log(error);
      }

      if(this.isComplete()){
        this.finish();
      }else{
        this.nextSlide();
      }
    });
  }
  backSlide(){
    this.triggerCallback("backSlide", this);
    let slides = this.setOrientation(this.currentIndex() - 1);
    this.setState({slides, startTime: Date.now()}, this.checkReady);
  }
  nextSlide(){
    let slides = this.setOrientation(this.currentIndex() + 1);
    this.setState({slides, startTime: Date.now()}, this.checkReady);
  }
  setOrientation(index, slides){
    slides = slides || this.state.slides;
    let farLeftSlide = slides[index - 2];
    let leftSlide = slides[index - 1];
    let middleSlide = slides[index];
    let rightSlide = slides[index + 1];
    let farRightSlide = slides[index - 2];

    if(farLeftSlide){
      farLeftSlide.orientation = "invisible";
      farLeftSlide.loaded = true;
    }
    if(leftSlide){ leftSlide.orientation = "left"; }
    if(middleSlide){ middleSlide.orientation = "middle"; }
    if(rightSlide){ rightSlide.orientation = "right"; }
    if(farRightSlide){ farRightSlide.orientation = "invisible"; }
    return slides;
  }
  finish(){
    if(this.state.finished){ return; }
    this.setState({finished: true, finishTime: Date.now()});
    this.props.client.put(`/assessments/${this.props.assessmentId}/slides`, this.completedSlides()).then((response)=>{
      this.triggerCallback("finished", this, response);
      this.props.fetch();
    });
  }
  progress(){
    return this.isComplete() ? 100 : this.currentIndex() / this.state.slides.length * 100;
  }
  completedSlides(){
    return this.state.slides.filter((slide)=>{
      return slide.response != null;
    }).map((slide)=>{
      return {
        id: slide.id,
        response: slide.response,
        time_taken: slide.time_taken || 12345
      };
    });
  }
  hasBackSlide(){
    return this.currentIndex() > 0;
  }
  isComplete(){
    return this.state.slides.length > 0 && this.state.slides.length === this.completedSlides().length;
  }
  handleBack(e){
    e.preventDefault();
    this.backSlide();
  }
  toggleFullScreen(){
    let fullscreen = this.props.isFullScreen;
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
      this.triggerCallback("fullscreen", this, false);
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
      this.props.isFullScreen = !fullscreen;
      this.props.setState(this.props);
      this.triggerCallback("fullscreen", this, !fullscreen);
    }
  }
  retry(e){
    e.preventDefault();
    let attempts = this.state.imageLoadAttempts;
    let i = attempts.length - 1;
    attempts[i] = 0;
    this.setState({imageLoadAttempts: attempts});
    this.prefetchSlides(i);
  }
  render(){
    if(this.state.slides.length === 0) return <span />;
    if(this.props.resultsReady()) return <span />;

    let currentSlide = this.currentSlide();
    let loading = this.isComplete() || !this.state.ready;

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
            <div class={style.captionContainer}>
              <div class={style.caption}>
                {currentSlide.caption}
              </div>
              <div class={style.progressContainer}>
                <div class={style.progress} style={{width: `${this.progress()}%`}} />
              </div>
            </div>
            {this.props.client.oldIE ? (
              <Slide key="slide" slide={currentSlide} client={this.props.client} />
            ) : this.loadedSlides().map((slide, index)=>{
              return <Slide key={index} slide={slide} client={this.props.client} />;
            })}
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
          this.props.allowBack && this.hasBackSlide() && (
            <a key="back" class={style.back} onClick={this.handleBack} href="#">
              <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
            </a>
          ),
          this.props.allowFullScreen && (
            <div key="fullscreen" class={[style.fullScreen, this.props.isFullScreen ? style.fullScreenSmall : ""].join(" ")} onClick={this.toggleFullScreen} />
          )
        ]}
      </div>
    );
  }
}
