import shuffle from "shuffle-array";
import uuidV1 from "uuid/v1";
import i18n from "../../src/lib/i18n";
import faker from 'faker';

let captions = [
  "Using a Microscope",
  "Media Production",
  "Swimming"
];

class Data {
  constructor(){
    this.personality_traits = [];
    this.personality_types = [];
    this.personality_blend = {};
    this.slides = [];

    this.completed_at = null;
    this.created_at = Date.now();
    this.deck_id = "career-deck";
    this.id = uuidV1();
    this.locale_key = "en-US";
    this.assessment_type = "TYPE_BASED";
    return this;
  }

  dimensionBased(){
    this.assessment_type = "DIMENSION_BASED";
    return this;
  }

  slides(){
    this.slides = Data.Slides();
    return this;
  }

  
  results(){
    this.personality_types = Data.PersonalityTypes();
    this.personality_blend = Data.PersonalityBlend(
      this.personality_types[0].personality_type,
      this.personality_types[1].personality_type
    );
    this.personality_traits = Data.PersonalityTraits();
    this.completed_at = Date.now();
    return this;
  }

  static PersonalityTrait(){
    return {
      definition: faker.lorem.words(),
      description: faker.lorem.words(),
      id: uuidV1(),
      personality_type: Data.PersonalityType(),
      name: faker.lorem.words().split(" ")[0]
    };
  }
  static PersonalityTraits(){
    let traits = [];
    for (let i=10; i!=0; i--){
      traits.push({personality_trait: Data.PersonalityTrait(), score: i * 10});
    }
    return traits;
  }
  static PersonalityType(){
    let id = uuidV1();
    let words = faker.lorem.words();

    return {
      id,
      name: `${words}tor`,
      description:`${words}tor are people-oriented.  They have great communication skills and are most fulfilled when assisting or working directly with others to improve a personal or societal situation. Mentors are patient and compassionate and work best in a group or on a team with a common goal. Mentors excel at working with others to help them learn and grow.`,
      badge:{
        image_small:`https://cdn.traitify.com/badges/${id}_small`,
        image_medium:`https://cdn.traitify.com/badges/${id}_medium`,
        image_large:`https://cdn.traitify.com/badges/${id}_large`,
        font_color:"",
        color_1: faker.internet.color().replace("#", ""),
        color_2:"",
        color_3:""
      },
      keywords:"helping, assisting, teaching, caring, interacting, improving (situations/lives), working as a team, having a greater goal",
      details:[],
      environments:[],
      famous_people:[],
      personality_traits:[],
      level:null
    };
  }

  static PersonalityTypes(){
    let types = [];
    for (let i=10; i!=0; i--){
      types.push({personality_type: Data.PersonalityType(), score: i * 10});
    }
    return types;
  }

  static PersonalityBlend(type1, type2){
    type1 = type1 || Data.PersonalityType();
    type2 = type2 || Data.PersonalityType();
    return {
      name: `${type1.name}/${type1.name}`,
      description: faker.lorem.paragraph(),
      details:[],
      environments:[],
      famous_people:[],
      keywords:"",
      personality_group: null,
      personality_type_1: type1,
      personality_type_2: type2
    };
  }

  static Slide(){
    let id = uuidV1();
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
      slides.push(Data.Slide());
    }
    return slides;
  }

  static Assessment(){
    return new Data();
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