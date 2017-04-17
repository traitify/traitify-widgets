import { h, Component } from "preact";

import I18n from "../lib/i18n";
import * as Components from "./index.js"

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
    };
    this.state.fetch = this.fetch.bind(this);
    this.state.resultsReady = this.resultsReady.bind(this);
    this.i18n = new I18n;
    this.state.translate = (key) => com.i18n.translate(key);
    this.state.i18n = this.i18n;
    this.state.triggerCallback = this.triggerCallback.bind(this);
    return this;
  }

  componentWillMount(){
    let com = this;
    Object.keys(this.props).forEach((key)=>{
      com.state[key] = com.props[key];
    });
    com.state.assessment = {};

    if (com.props.locale){
      com.i18n.locale = com.props.locale;
    }
    this.setState(this.state, ()=>{
      com.fetch();
    });
  }

  componentDidMount(){
    this.props.renderPromise.resolve(this);
  }

  triggerCallback(klass, action, context, options){
    let com = this;
    let key = `${klass}.${action}`.toLowerCase();

    if (this.state.callbacks[key]){
      com.state.callbacks[key].forEach((callback)=>{
        callback.apply(com, [context, options]);
      });
    }
  }

  fetch (){
    let com = this;
    let storeKey = `results-${com.state.assessmentId}-${com.i18n.locale}`;
    let setData = function(data) {
      com.i18n.locale || com.i18n.setLocale(data.locale_key);
      com.state.assessment = data;
      com.triggerCallback("Main", "fetch", com);
      com.setState(com.state);
    }

    if (sessionStorage.getItem(storeKey)){
      setData(JSON.parse(sessionStorage.getItem(storeKey)));
    } else {
      this.props.client.get(`/assessments/${com.state.assessmentId}?data=slides,blend,types,traits&locale_key=${com.i18n.locale}`).then((data)=>{
        if (data.personality_types.length > 0){
          sessionStorage.setItem(storeKey, JSON.stringify(data));
        }
        setData(data);
      }).catch((error)=>{
        console.warn(error);
      });
    }
  }

  resultsReady() {
    let assessment = this.state.assessment || {};
    assessment.personality_types = assessment.personality_types || [];
    return assessment.personality_types.length > 0;
  }

  render() {
    let component = Components[this.props.componentName || "Default"];
    let link = document.createElement("style");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600";
    document.body.appendChild(link);

    return h(component, this.state);
  }
}
