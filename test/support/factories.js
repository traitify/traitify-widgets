import shuffle from "shuffle-array";
import uuidV1 from "uuid/v1";
import i18n from "../../src/lib/i18n";

let captions = [
  "Using a Microscope",
  "Media Production",
  "Swimming"
];

class Data {
  constructor(){
    return this;
  }
  static Slide(){
    let id = 1; //uuidV1();
    return {
      id,
      position: 1,
      caption: captions[0],
      image_desktop: `https://traitify-api.s3.amazonaws.com/slides/${id}/desktop`,
      image_desktop_retina: `https://traitify-api.s3.amazonaws.com/slides/${id}/desktop_retina`,
      response: null,
      time_taken: null,
      completed_at: null,
      created_at: null
    };
  }
  static Slides(){
    let slides = [];
    for (let i=40; i != 0; i--){
      slides.push(this.Slide());
    }
    return slides;
  }
}
class Props {
  static i18n(){
    return new i18n;
  }
  static Main(){
    return {
      triggerCallback: (component, key, context, options)=>{},
      assessment: {
        slides: Data.Slides()
      },
      i18n: Props.i18n(),
      setState: (options)=>{ }
    };
  }
}

export default {
  Data,
  Props
};