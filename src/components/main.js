import {h, Component} from "preact";

import I18n from "../lib/i18n";
import * as Components from "./index.js";

export default class Main extends Component{
  constructor(){
    super();

    let state = {
      assessment: {
        personality_traits: [],
        personality_types: [],
        slides: []
      }
    };

    this.state = state;
    this.state.setState = (newState)=>{
      this.setState(newState);
    };
    this.state.fetch = this.fetch.bind(this);
    this.state.resultsReady = this.resultsReady.bind(this);
    this.i18n = new I18n;
    this.state.translate = (key)=>this.i18n.translate(key);
    this.state.i18n = this.i18n;
    this.state.triggerCallback = this.triggerCallback.bind(this);
    return this;
  }

  componentWillMount(){
    Object.keys(this.props).forEach((key)=>{
      this.state[key] = this.props[key];
    });
    this.state.assessment = {};

    if(this.props.locale){
      this.i18n.locale = this.props.locale;
    }

    this.setState(this.state, ()=>{
      this.state.fetch();
    });
  }

  componentDidMount(){
    this.props.renderPromise.resolve(this);
  }

  triggerCallback(klass, action, context, options){
    let key = `${klass}.${action}`.toLowerCase();

    if(this.state.callbacks[key]){
      this.state.callbacks[key].forEach((callback)=>{
        callback.apply(this, [context, options]);
      });
    }
  }

  fetch(){
    let storeKey = `results-${this.state.assessmentId}-${this.i18n.locale}`;
    let setData = (data)=>{
      this.i18n.locale || this.i18n.setLocale(data.locale_key);
      this.triggerCallback("Main", "fetch", this);
      this.setState({assessment: data});
    };

    if(sessionStorage.getItem(storeKey)){
      setData(JSON.parse(sessionStorage.getItem(storeKey)));
    }else{
      this.props.client.get(`/assessments/${this.state.assessmentId}?data=slides,blend,types,traits&locale_key=${this.i18n.locale}`).then((data)=>{
        if(data && data.personality_types && data.personality_types.length > 0){
          try{
            sessionStorage.setItem(storeKey, JSON.stringify(data));
          }catch(error){
            console.log(error);
          }
        }
        setData(data);
      }).catch((error)=>{
        console.warn(error);
      });
    }
  }

  resultsReady(){
    let assessment = this.state.assessment || {};
    assessment.personality_types = assessment.personality_types || [];
    return assessment.personality_types.length > 0;
  }

  render(){
    let component = Components[this.props.componentName || "Default"];
    let fontURL = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600";
    let font = document.querySelector(`link[href='${fontURL}']`);
    if(!font){
      font = document.createElement("link");
      font.rel = "stylesheet";
      font.type = "text/css";
      font.href = fontURL;
      document.body.appendChild(font);
    }

    return h(component, this.state);
  }
}
