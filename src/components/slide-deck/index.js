import { h, Component } from "preact";
import Slide from "./_slide";
import style from "./index.scss";

export default class SlideDeck extends Component {
  constructor(props){
    super(props);
    this.imageLoadAttempts = [];
    return this;
  }
  imageService(slide){
    return slide ? slide.image_desktop : null;
  }
  prefetchSlides(i){
    if (i != this.slides().length){
      let com = this;
      let img = document.createElement("img");
      if (this.imageService(this.props.assessment.slides[i])){
        img.src = this.imageService(this.props.assessment.slides[i]);
        img.onload = ()=>{
          if (i >= com.currentIndex() + 2){
            com.setReady(true);
          }
          com.props.assessment.slides[i].loaded = true;
          com.props.setState(com.props);
          com.triggerCallback('prefetchSlides', this);
          com.prefetchSlides(i + 1);
        };
        img.onerror = ()=>{
          com.imageLoadAttempts[i] = com.imageLoadAttempts[i] || 0;
          com.imageLoadAttempts[i] += 1;
          if (com.imageLoadAttempts[i] < 30){
            setTimeout(()=>{
              com.prefetchSlides(i);
            }, 2000);
          } else {
            com.props.setState(com.props);
          }
        };
      }
    }
  }
  slides(){
    let slides = (this.props.assessment.slides || []);
    slides = slides.map((slide)=>{
      slide.image = this.imageService(slide);
      return slide;
    });
    return slides;
  }
  loadedSlides(){
    let slides = this.slides();

    let loadedSlides = slides.filter((slide)=>{
      return slide.loaded;
    });

    return loadedSlides;
  }
  currentSlide(){
    return this.slides().filter((slide)=>{
      return slide.orientation == "middle";
    })[0] || {};
  }
  triggerCallback(key, context, options){
    this.props.triggerCallback("slidedeck", key, context, options);
  }
  answerSlide(value, e){
    e.preventDefault();
    let key = value ? "me" : "notme";
    this.triggerCallback(key, this);
    this.triggerCallback('answerslide', this, value);

    let slide = this.currentSlide();
    slide.response = value;
    slide.time_taken = Date.now() - this.lastSlideAnswered;
    try{
      sessionStorage.setItem(`slides-${this.props.assessmentId}`, JSON.stringify(this.answers()));
    }catch(error){
      console.log(error);
    }
    this.lastSlideAnswered = Date.now();
    this.props.setState(this.props);

    if (this.isComplete()){
      this.finish();
    } else {
      this.nextSlide();
    }
  }
  currentIndex(){
    return this.slides().map((slide)=>{ return slide.id; }).indexOf(this.currentSlide().id);
  }
  backSlide(){
    this.triggerCallback("backslide", this);
    let slides = this.props.assessment.slides;
    let i = this.currentIndex();
    slides[i].orientation = "right";
    slides[i - 1].orientation = "middle";
    if (slides[i - 2]){
      slides[i - 2].orientation = "left";
    }
    if (i > 0){
      slides[i + 1].orientation = "invisible";
    }
    this.lastSlideAnswered = Date.now();
    this.props.setState(this.props);
  }
  nextSlide(){
    let slides = this.props.assessment.slides;
    let i = this.currentIndex();
    slides[i].orientation = "left";
    slides[i + 1].orientation = "middle";
    if (slides[i + 2]){
      slides[i + 2].orientation = "right";
    }
    if (i > 0){
      slides[i - 1].orientation = "invisible";
    }
    this.props.setState(this.props);
  }
  finish(){
    let com = this;
    let answers = this.slides().map((slide)=>{
      let time_taken = typeof slide.time_taken == "number" && slide.time_taken > 0 ? slide.time_taken : 12345;
      return {
        id: slide.id,
        time_taken,
        response: slide.response
      };
    });

    this.props.client.put(`/assessments/${this.props.assessmentId}/slides`, answers).then((response)=>{
      com.triggerCallback("finished", this, response);
      com.props.fetch();
    });
  }
  componentDidMount(){
    this.lastSlideAnswered = Date.now();
    if (this.slides()){
      this.initialize();
    }
  }
  componentWillReceiveProps(){
    if (this.slides()){
      this.initialize();
    }
    this.shouldAllowNext();
  }
  shouldAllowNext(){
    if (this.currentIndex() <= this.loadedSlides().length  - 2 || this.currentIndex() > this.slides().length - 2){
      this.setReady(true);
    } else {
      this.setReady(false);
    }
  }
  setReady(value){
    if (this.props.ready != value){
      this.triggerCallback('isReady', this, this.props.ready);
      this.props.ready = value;
      this.props.setState(this.props);
    }
  }
  initialize(){
    if (!this.props.assessment.slides || this.props.assessment.slides.length == 0 || this.props.assessment.slides.initialized){
      return false;
    }

    let com = this;
    if (this.props.assessment.slides && this.props.assessment.slides.length != 0){
      let slides = this.props.assessment.slides.filter((s)=>{ return s.orientation; });
      // Initialize Widget because data is now here
      if (slides.length == 0){
        this.props.assessment.slides[0].orientation = "middle";
        this.props.assessment.slides[1].orientation = "right";
        let answers = [];
        if (sessionStorage.getItem(`slides-${this.props.assessmentId}`)){
          try {
            answers = JSON.parse(sessionStorage.getItem(`slides-${this.props.assessmentId}`));
          } catch (e){
            console.log(`Answers JSON.parse error ${e}`);
          }
        }

        this.answers(answers || []);
        this.lastSlideAnswered = Date.now();

        this.props.assessment.slides.forEach((slide, index)=>{
          if (com.answer(slide.id)){
            slide.response = com.answer(slide.id).response;
            slide.time_taken = slide.time_taken;
            let si = this.props.assessment.slides[index - 1];
            let sl = this.props.assessment.slides[index];
            let sm = this.props.assessment.slides[index + 1];
            let sr = this.props.assessment.slides[index + 2];
            if (si)
              si.orientation = "invisible";
            if (sl)
              sl.orientation = "left";
            if (sm)
              sm.orientation = "middle";
            if (sr)
              sr.orientation = "right";
          }
        });

        this.props.assessment.slides.initialized = true;
        this.props.assessment.slides = this.props.assessment.slides.map((slide, index)=>{
          if (index < com.currentIndex()){
            slide.loaded = true;
          }

          return slide;
        });

        this.props.setState(this.props);



        // Detach into thread
        setTimeout(()=>{
          com.prefetchSlides(this.currentIndex());
        }, 0);

        this.triggerCallback('initialized', this);
        if (this.isComplete()){
          this.finish();
          return this.props;
        }
      }
    }
  }
  completion(){
    return this.currentIndex() / this.slides().length * 100;
  }
  answers(answers){
    if (answers){
      let newAnswers = {};

      answers.forEach((answer)=>{
        newAnswers[answer.id] = answer;
      });

      this.props.assessment.slides.map((slide)=>{
        if (newAnswers[slide.id]){
          slide.response = newAnswers[slide.id].response;
          slide.time_taken = newAnswers[slide.id].time_taken;
        }
        return slide;
      });

      this.props.setState(this.props);
    } else {
      return this.props.assessment.slides
        .filter((slide)=>{
          return slide.response != null;
        })
        .map((slide)=>{
          return {
            id: slide.id,
            response: slide.response,
            time_taken: slide.time_taken
          };
        }) || [];
    }
  }
  answer(slideId){
    if (!slideId){
      return null;
    }
    return this.answers().filter((answer)=>{
      return answer.id == slideId;
    })[0];
  }
  isBackSlide(){
    return this.currentIndex() > 0;
  }
  isComplete(){
    let value = false;
    if ((this.props.assessment || {}).slides){
      value = this.slides().length == this.answers().length;
    }
    return value;
  }
  isReady(){
    return this.props.ready;
  }
  handleBack(e){
    e.preventDefault();
    this.backSlide();
  }
  handleFullScreen(){
    let i = this.container;
    if (this.props.isFullScreen){
      this.props.isFullScreen = false;
      this.props.setState(this.props);
      if (document.exitFullscreen){
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen){
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen){
        document.msExitFullscreen();
      }
      this.triggerCallback('fullscreen', this, false);
    } else {
      this.props.isFullScreen = true;
      this.props.setState(this.props);
      if (i.requestFullscreen) {
        i.requestFullscreen();
      } else if (i.webkitRequestFullscreen){
        i.webkitRequestFullscreen();
      } else if (i.mozRequestFullScreen){
        i.mozRequestFullScreen();
      } else if (i.msRequestFullscreen){
        i.msRequestFullscreen();
      }
      this.triggerCallback('fullscreen', this, true);
    }
  }
  retry(e){
    e.preventDefault();
    let i = this.imageLoadAttempts.length - 1;
    this.imageLoadAttempts[i] = 0;
    this.prefetchSlides(i);
    this.props.setState(this.props);
  }
  render() {
    if (this.slides().length == 0) return <span />;

    let coverVisible = [style.cover];
    if (!this.isReady()){
      coverVisible.push(style.visible);
    }

    return (
      <div class={style.widgetContainer} ref={(container) => { this.container = container; }}>
        <div class={coverVisible.join(" ")}>
          <div class={style.loading}>
            {this.imageLoadAttempts[this.imageLoadAttempts.length - 1] >= 30 ? (
              <div class={style.retry}>
                <div class={style.label}>
                  Unable to load more slides at this time.
                </div>
                <a href="#" class={style.link} onClick={this.retry.bind(this)}>
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
        <div class={style.slideContainer}>
          <div class={style.captionContainer}>
            <div class={style.caption}>
              {this.currentSlide().caption}
            </div>
            <div class={style.progressContainer}>
              <div class={style.progress} style={{width: `${this.completion()}%`}} />
            </div>
          </div>
          {this.props.client.oldIE?(
            <Slide slide={this.currentSlide()} key={'slide'} client={this.props.client} />
          ):this.loadedSlides().map((slide, index)=>{
            return <Slide slide={slide} key={index} client={this.props.client} />;
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
        {this.props.allowBack && this.isBackSlide() && (
          <a class={style.back} onClick={this.handleBack.bind(this)} href="#">
            <img src="https://cdn.traitify.com/assets/images/arrow_left.svg" alt="Back" />
          </a>
        )}
        {this.props.allowFullScreen && (
          <div class={[style.fullScreen, this.props.isFullScreen ? style.fullScreenSmall : ''].join(" ") } onClick={this.handleFullScreen.bind(this)}></div>
        )}
      </div>
    );
  }
}
