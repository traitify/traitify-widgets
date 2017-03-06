import { h, Component } from "preact";

import I18n from "../lib/i18n";
import SlideDeck from "./slidedeck/index";
import Default from "./default"
import Results from "./results";

let components = {
  SlideDeck,
  Results,
  Default
}

export default class Main extends Component {
  constructor(){
    super();

    let com = this;
    let state = {
      assessment: {
        personality_traits: [],
        personality_types: [],
        slides: []
      }
    };

    this.state = state;

    this.state.setState = function(newState){
      com.setState(newState);
    }
    this.state.fetch = this.fetch.bind(this);

    this.i18n = new I18n;
    this.state.translate = (key) => com.i18n.translate(key);
    this.state.i18n = this.i18n;
    this.state.triggerCallback = this.triggerCallback.bind(this)
    return this;
  }

  componentWillMount(){
    let com = this;
    Object.keys(this.props).forEach((key)=>{
      com.state[key] = com.props[key];
    })
    com.state.assessment = {};
    if(com.props.locale){
      com.i18n.locale = com.props.locale;
    }
    this.setState(this.state, ()=>{
        com.fetch();
    })
  }

  triggerCallback(klass, key, options){
    let com = this;

    if(this.state.callbacks[`${klass}.${key}`]){
      com.state.callbacks[`${klass}.${key}`].forEach((callback)=>{
        callback.apply(com, [options]);
      })
    }
  }

  fetch (){
    let com = this;
    Traitify.get(`/assessments/${com.state.assessmentId}?data=slides,blend,types,traits&locale_key=${com.i18n.locale}`).then((data)=>{
      com.triggerCallback("main", "fetch", false);
      com.i18n.locale || com.i18n.setLocale(data.locale_key);
      com.state.assessment = data;
      com.setState(com.state);
    })
  }

  render() {
    var component = components[this.props.componentName || "Default"];
    return (
      <div>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600" />
        {h(component, this.state)}
      </div>
    )
  }
}
