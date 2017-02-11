import { h, Component } from "preact";
import Slide from "./_slide";
import style from "./index.scss";

export default class slideDeck extends Component {
  constructor(){
    super();
    this.state = {};

    return this;
  }

  onComplete(){
    this.props.fetch()
  }

  screen(){
    var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
    var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

    return {
      width,
      height,
      ratio: width / height
    }
  }

  currentWidth(){
    let part = this.screen().width * 1.5;
    return Math.round(part * .01) * 10;
  }

  currentHeight(){
    let part = this.screen().height * 1.5
    return Math.round(part * .01) * 10;
  }

  imageService(slide){
    return slide.image_desktop
  }

  prefetchSlides(i){
    if(i != this.slides().length){
      let com = this;
      let img = document.createElement("img")
      img.src = this.imageService(this.props.assessment.slides[i])
      img.onload = ()=>{
        if(i >= com.currentIndex() + 2){
          setTimeout(()=>{
            this.props.ready = true
            this.props.setState(this.props)
          }, 600)
        }
        com.props.assessment.slides[i].loaded = true;
        com.props.setState(com.props);
        com.prefetchSlides(i + 1);
      }
    }
  }

  slides(){
    let slides = (this.props.assessment.slides || [])
    slides = slides.map((slide)=>{
      slide.image = this.imageService(slide);
      return slide;
    })
    return slides;
  }

  loadedSlides(){
    let slides = this.slides()

    let loadedSlides = slides.filter((slide)=>{
      return slide.loaded;
    })
    let com = this;

    return loadedSlides;
  }

  currentSlide(){
    return this.slides().filter((slide)=>{
      return slide.orientation == "middle";
    })[0] || {}
  }

  answerSlide(value, e){
    e.preventDefault();

    var lastSlide = this.props.assessment.slides.lastAnswer
    this.props.assessment.slides.answers = this.props.assessment.slides.answers || {};
    this.props.assessment.slides.answers[this.currentSlide().id] = {
      value: value,
      timeTaken: new Date() - lastSlide
    }
    sessionStorage.setItem(`slides-${this.props.assessmentId}`, JSON.stringify(this.props.assessment.slides.answers))
    this.props.assessment.slides.lastAnswer = new Date()
    this.props.setState(this.props)
    if(this.isComplete()){
      this.finish()
    }else{
      this.nextSlide()
    }
  }

  currentIndex(){
    return this.slides().map((slide)=>{ return slide.id }).indexOf(this.currentSlide().id)
  }

  nextSlide(){
    let slides = this.props.assessment.slides;
    let i = this.currentIndex()
    slides[i].orientation = "left"
    slides[i + 1].orientation = "middle"
    if(slides[i + 2]){
      slides[i + 2].orientation = "right"
    }
    if(i > 0){
      slides[i - 1].orientation = "invisible"
    }
    this.props.setState(this.props)
  }

  finish(){
    let com = this;
    let answers = this.props.assessment.slides.answers
    let postData = Object.keys(answers).map((answerKey)=>{
      let answer = answers[answerKey];
      return {
        id: answerKey,
        time_taken: answer.timeTaken,
        response: answer.value
      }
    })

    Traitify.put(`/assessments/${this.props.assessmentId}/slides`, postData).then((response)=>{
      if(this.props.callbacks['slidedeck.finished']){
        com.props.callbacks['slidedeck.finished'].forEach((callback)=>{
          callback.apply(com, response)
        })
      }
      
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
      this.setReady(false)
    }else{
      this.setReady(true)
    }
  }

  setReady(value){
    if(this.props.ready != value){
      this.props.ready = value
      this.props.setState(this.props)
    }
  }

  initialize(){
    if(!this.props.assessment.slides || this.props.assessment.slides.length == 0 || this.props.assessment.slides.initialized){
      return false;
    }

    var com = this;
    if(this.props.assessment.slides && this.props.assessment.slides.length != 0){
      let slides = this.props.assessment.slides.filter((s)=>{ return s.orientation })
      // Initialize Widget because data is now here
      if(slides.length == 0){
        if(this.isComplete()){
          this.finish()
          return this.props;
        }
        this.props.assessment.slides[0].orientation = "middle"
        this.props.assessment.slides[1].orientation = "right"
        var answers = {};
        if(sessionStorage.getItem(`slides-${this.props.assessmentId}`)){
          try{
            answers = JSON.parse(sessionStorage.getItem(`slides-${this.props.assessmentId}`))
          }catch(e){
          }
        }

        this.props.assessment.slides.lastAnswer = new Date();
        this.props.assessment.slides.answers = answers;

        this.props.assessment.slides.forEach((slide, index)=>{
          if(answers[slide.id]){
            let si = props.assessment.slides[index - 1]
            let sl = props.assessment.slides[index]
            let sm = props.assessment.slides[index + 1]
            let sr = props.assessment.slides[index + 2]
            if(si)
              si.orientation = "invisible"
            if(sl)
              sl.orientation = "left"
            if(sm)
              sm.orientation = "middle"
            if(sr)
              sr.orientation = "right"
          }
        })

        this.props.assessment.slides.initialized = true

        this.props.setState(this.props)
        // Detach into thread
        setTimeout(()=>{
          com.prefetchSlides(com.currentIndex())
        }, 0)
      }
    }
  }

  completion(){
    return this.currentIndex() / this.slides().length * 100
  }

  isComplete(){
    if(((this.props.assessment || {}).slides || {}).answers){
      return this.slides().length == Object.keys(this.props.assessment.slides.answers).length
    }else{
      return false;
    }
  }

  isReady(){
    return this.props.ready
  }

  handleFullScreen(){
    var i = this.container
    if(this.props.isFullScreen){
      this.props.isFullScreen = false
      this.props.setState(this.props)
      if (document.exitFullscreen) {
      	document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
      	document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
      	document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
      	document.msExitFullscreen();
      }
    }else{
      this.props.isFullScreen = true
      this.props.setState(this.props)
      if (i.requestFullscreen) {
      	i.requestFullscreen();
      } else if (i.webkitRequestFullscreen) {
      	i.webkitRequestFullscreen();
      } else if (i.mozRequestFullScreen) {
      	i.mozRequestFullScreen();
      } else if (i.msRequestFullscreen) {
      	i.msRequestFullscreen();
      }
    }
  }

  render() {
    if(!this.slides()){
      return <span />
    }
    var coverVisible = [style.cover]
    if(!this.isReady())
      coverVisible.push(style.visible)

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
              Me
            </a>
            <a class={style.notMe} onClick={this.answerSlide.bind(this, false)} href="#">
              Not Me
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
