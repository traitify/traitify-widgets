import { h, Component } from "preact";
import Slide from "./_slide";
import style from "./index.scss";

export default class slideDeck extends Component {
  onComplete(){
    this.props.fetch();
  }
  imageService(slide){
    return slide.image_desktop;
  }
  prefetchSlides(i){
    if(i != this.slides().length){
      let com = this;
      let img = document.createElement("img");
      img.src = this.imageService(this.props.assessment.slides[i]);
      img.onload = ()=>{
        if(i >= com.currentIndex() + 2){
          setTimeout(()=>{
            this.props.ready = true;
            this.props.setState(this.props);
          }, 600)
        }else{
          com.triggerCallback('prefetchSlides');
        }
        com.props.assessment.slides[i].loaded = true;
        com.props.setState(com.props);
        com.prefetchSlides(i + 1);
      }
    }
  }
  slides(){
    let slides = (this.props.assessment.slides || []);
    slides = slides.map((slide)=>{
      slide.image = this.imageService(slide);
      return slide;
    })
    return slides;
  }
  loadedSlides(){
    let slides = this.slides();

    let loadedSlides = slides.filter((slide)=>{
      return slide.loaded;
    })

    return loadedSlides;
  }
  currentSlide(){
    return this.slides().filter((slide)=>{
      return slide.orientation == "middle";
    })[0] || {}
  }
  triggerCallback(key, options){
    this.props.triggerCallback("slidedeck", key, options)
  }
  answerSlide(value, e){
    e.preventDefault();
    let key = value ? "me" : "notme";
    this.triggerCallback(key);
    this.triggerCallback('answerSlide', value);

    var lastSlide = this.props.assessment.slides.lastAnswer;
    this.props.assessment.slides.answers = this.props.assessment.slides.answers || {};
    this.props.assessment.slides.answers[this.currentSlide().id] = {
      value: value,
      timeTaken: new Date() - lastSlide
    }
    sessionStorage.setItem(`slides-${this.props.assessmentId}`, JSON.stringify(this.props.assessment.slides.answers))
    this.props.assessment.slides.lastAnswer = new Date();
    this.props.setState(this.props);

    if(this.isComplete()){
      this.finish();
    }else{
      this.nextSlide();
    }
  }
  currentIndex(){
    return this.slides().map((slide)=>{ return slide.id }).indexOf(this.currentSlide().id);
  }
  nextSlide(){
    let slides = this.props.assessment.slides;
    let i = this.currentIndex();
    slides[i].orientation = "left";
    slides[i + 1].orientation = "middle";
    if(slides[i + 2]){
      slides[i + 2].orientation = "right";
    }
    if(i > 0){
      slides[i - 1].orientation = "invisible";
    }
    this.props.setState(this.props);
  }
  finish(){
    let com = this;
    let answers = this.props.assessment.slides.answers;
    let postData = Object.keys(answers).map((answerKey)=>{
      let answer = answers[answerKey];
      return {
        id: answerKey,
        time_taken: answer.timeTaken,
        response: answer.value
      }
    })

    Traitify.put(`/assessments/${this.props.assessmentId}/slides`, postData).then((response)=>{
      com.triggerCallback("finished", response)
      com.props.fetch()
    })
  }
  componentDidMount(){
    if(this.slides()){
      this.initialize()
    }
  }
  componentWillReceiveProps(){
    if(this.slides()){
      this.initialize()
    }
    this.shouldAllowNext()
  }
  shouldAllowNext(){
    if(this.currentIndex() >= this.loadedSlides().length  - 2 && this.currentIndex() < this.slides().length - 2){
      this.setReady(false);
    }else{
      this.setReady(true);
    }
  }
  setReady(value){
    if(this.props.ready != value){
      this.triggerCallback('isReady', this.props.ready);
      this.props.ready = value;
      this.props.setState(this.props);
    }
  }
  initialize(){
    if(!this.props.assessment.slides || this.props.assessment.slides.length == 0 || this.props.assessment.slides.initialized){
      return false;
    }

    var com = this;
    if(this.props.assessment.slides && this.props.assessment.slides.length != 0){
      let slides = this.props.assessment.slides.filter((s)=>{ return s.orientation });
      // Initialize Widget because data is now here
      if(slides.length == 0){
        if(this.isComplete()){
          this.finish();
          return this.props;
        }
        this.props.assessment.slides[0].orientation = "middle";
        this.props.assessment.slides[1].orientation = "right";
        var answers = {};
        if(sessionStorage.getItem(`slides-${this.props.assessmentId}`)){
          try{
            answers = JSON.parse(sessionStorage.getItem(`slides-${this.props.assessmentId}`));
          }catch(e){
          }
        }

        this.props.assessment.slides.lastAnswer = new Date();
        this.props.assessment.slides.answers = answers;

        this.props.assessment.slides.forEach((slide, index)=>{
          if(answers[slide.id]){
            let si = props.assessment.slides[index - 1];
            let sl = props.assessment.slides[index];
            let sm = props.assessment.slides[index + 1];
            let sr = props.assessment.slides[index + 2];
            if(si)
              si.orientation = "invisible";
            if(sl)
              sl.orientation = "left";
            if(sm)
              sm.orientation = "middle";
            if(sr)
              sr.orientation = "right";
          }
        })

        this.props.assessment.slides.initialized = true;

        this.props.setState(this.props);
        // Detach into thread
        setTimeout(()=>{
          com.prefetchSlides(com.currentIndex());
        }, 0)
        this.triggerCallback('initialized');
      }
    }
  }
  completion(){
    return this.currentIndex() / this.slides().length * 100;
  }
  isComplete(){
    if(((this.props.assessment || {}).slides || {}).answers){
      return this.slides().length == Object.keys(this.props.assessment.slides.answers).length;
    }else{
      return false;
    }
  }
  isReady(){
    return this.props.ready;
  }
  handleFullScreen(){
    var i = this.container;
    if(this.props.isFullScreen){
      this.props.isFullScreen = false;
      this.props.setState(this.props);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.triggerCallback('fullscreen', false);
    }else{
      this.props.isFullScreen = true;
      this.props.setState(this.props);
      if (i.requestFullscreen) {
        i.requestFullscreen();
      } else if (i.webkitRequestFullscreen) {
        i.webkitRequestFullscreen();
      } else if (i.mozRequestFullScreen) {
        i.mozRequestFullScreen();
      } else if (i.msRequestFullscreen) {
        i.msRequestFullscreen();
      }
      this.triggerCallback('fullscreen', true);
    }
  }
  render() {
    if(!this.slides()){
      return <span />
    }
    var coverVisible = [style.cover]
    if(!this.isReady())
      coverVisible.push(style.visible);

    return (
      <div class={style.widgetContainer} ref={(container) => { this.container = container; }}>
        <div class={coverVisible.join(" ")}>
          <div class={style.loading}>
            <div class={style.symbol}>
              <i />
              <i />
            </div>
          </div>
        </div>
        <div class={style.slideContainer}>
          <div class={style.captionContainer}>
            <div class={style.caption}>
              {this.currentSlide().caption}
            </div>
            <div class={style.progressContainer}>
              <div class={style.progress} style={{width: `${this.completion()}%`}} />
            </div>
          </div>
          {this.loadedSlides().map((slide)=>{
            return <Slide slide={slide} key={slide.id} />
          })}
        </div>
        <div class={style.responseContainer}>
          <div class={style.buttons}>
            <a class={style.me} onClick={this.answerSlide.bind(this, true)} href="#">
              {this.props.i18n.t("me")}
            </a>
            <a class={style.notMe} onClick={this.answerSlide.bind(this, false)} href="#">
              {this.props.i18n.t("not_me")}
            </a>
          </div>
        </div>
        {this.props.allowFullScreen && (
          <div class={style.fullScreen} onClick={this.handleFullScreen.bind(this)}><div class={style.fullScreenBorder} /></div>
        )}
      </div>
    )
  }
}
