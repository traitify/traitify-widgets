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

  prefetchSlides(i){
    if(i != this.slides().length){
      let com = this;
      let img = document.createElement("img")
      img.src = this.props.assessment.slides[i].image_desktop_retina
      img.onload = ()=>{
        com.props.assessment.slides[i].loaded = true;
        com.props.setState(com.props);
        com.prefetchSlides(i + 1);
      }
    }
  }

  slides(){
    return (this.props.assessment.slides || [])
  }

  loadedSlides(){
    let slides = this.slides()

    let loadedSlides = slides.filter((slide)=>{
      return slide.loaded;
    })
    let com = this;
    if(loadedSlides.length == 0 && slides.length != 0){
      setTimeout(()=>{
        com.prefetchSlides(0)
      }, 0)
    }
    return loadedSlides;
  }

  currentSlide(){
    return this.loadedSlides().filter((slide)=>{
      return slide.orientation == "middle";
    })[0] || {}
  }

  answerSlide(value){
    var lastSlide = this.props.assessment.slides.lastAnswer
    this.props.assessment.slides.answers = this.props.assessment.slides.answers || {};
    this.props.assessment.slides.answers[this.currentSlide().id] = {
      value: value,
      timeTaken: new Date() - lastSlide
    }
    sessionStorage.setItem('slides', JSON.stringify(this.props.assessment.slides.answers))
    this.props.assessment.slides.lastAnswer = new Date()
    this.props.setState(this.props)
    this.nextSlide()
  }

  currentIndex(){
    return this.slides().map((slide)=>{ return slide.id }).indexOf(this.currentSlide().id)
  }

  nextSlide(){
    let slides = this.props.assessment.slides;
    let i = this.currentIndex()
    slides[i].orientation = "left"
    slides[i + 1].orientation = "middle"
    slides[i + 2].orientation = "right"
    if(i > 0){
      slides[i - 1].orientation = "invisible"
    }
    this.props.setState(this.props)
  }

  componentWillUpdate(nextProps){
    if(nextProps.assessment.slides && nextProps.assessment.slides.length != 0){
      let slides = nextProps.assessment.slides.filter((s)=>{ return s.orientation })

      // Initialize Widget because data is now here
      if(slides.length == 0){
        nextProps.assessment.slides[0].orientation = "middle"
        nextProps.assessment.slides[1].orientation = "right"

        // TODO: Make this acctually work!
        var answers = {};
        if(sessionStorage.getItem('slides')){
          try{
            answers = JSON.parse(sessionStorage.getItem('slides'))
          }catch(e){
          }
        }

        nextProps.assessment.slides.lastAnswer = new Date();
        nextProps.assessment.slides.answers = answers;

        nextProps.assessment.slides.forEach((slide, index)=>{
          if(answers[slide.id]){
            (nextProps.assessment.slides[index] || {}).orientation = "left"
            nextProps.assessment.slides[index + 1].orientation = "middle"
            nextProps.assessment.slides[index + 2].orientation = "right"
          }
        })

        nextProps.setState(nextProps)
      }
    }
  }

  completion(){
    return this.currentIndex() / this.slides().length * 100
  }

  render() {
    return (
      <div class={style.widgetContainer}>
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
            <div class={style.me} onClick={this.answerSlide.bind(this, true)}>
              Me
            </div>
            <div class={style.notMe} onClick={this.answerSlide.bind(this, false)}>
              Not Me
            </div>
          </div>
        </div>
      </div>
    )
  }
}
