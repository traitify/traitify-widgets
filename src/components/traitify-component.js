import Airbrake from "airbrake-js";
import I18n from "lib/i18n";
import {Component} from "preact";
import {loadFont} from "lib/helpers";

// Unwrap Airbrake's console wrapper
["debug", "log", "info", "warn", "error"].forEach((method)=>{
  if(method in console && console[method].inner){
    console[method] = console[method].inner;
  }
});

export default class TraitifyComponent extends Component{
  constructor(props){
    super(props);

    this.setTraitify();
    this.setAirbrake();
    this.setI18n();
    this.loadFonts();

    this.following = {
      assessments: {},
      decks: {}
    };
  }
  cacheGet(key){
    try{
      const data = sessionStorage.getItem(key);

      return data ? JSON.parse(data) : null;
    }catch(error){ return; }
  }
  cacheKey(type, id){
    return `${type}-${id}-${this.i18n.locale}`;
  }
  cacheSet(key, data){
    try{
      return sessionStorage.setItem(key, JSON.stringify(data));
    }catch(error){ return; }
  }
  copyOptions(){
    const {airbrake, i18n, traitify} = this;
    const {assessment, assessmentID, deck} = this.state;
    const {options, ...props} = this.props;
    const managedOptions = {
      airbrake,
      assessment,
      assessmentID,
      deck,
      i18n,
      traitify
    };

    Object.keys(props).forEach((option)=>{ if(props[option] == null){ delete props[option]; } });
    Object.keys(options).forEach((option)=>{ if(options[option] == null){ delete options[option]; } });
    Object.keys(managedOptions).forEach((option)=>{ if(managedOptions[option] == null){ delete managedOptions[option]; } });

    return {
      ...options,
      ...props,
      ...managedOptions
    };
  }
  followAssessment(){
    const _assessment = this.getOption("assessment");
    const assessmentID = _assessment ? _assessment.id : this.getOption("assessmentID");
    if(!assessmentID){ return; }

    if(this.following.assessments[assessmentID]){ return; }
    this.following.assessments[assessmentID] = true;

    this.traitify.ui.on(`Assessment.${assessmentID}`, (_, assessment)=>{
      this.setState({assessment, assessmentID: assessment.id, deck: null});
    });

    this.getAssessment();
  }
  followDeck(){
    const {assessment} = this.state;
    const deckID = assessment && assessment.deck_id;
    if(!deckID){ return; }

    if(this.following.decks[deckID]){ return; }
    this.following.decks[deckID] = true;

    this.traitify.ui.on(`Deck.${deckID}`, (_, deck)=>{
      this.setState({deck});
    });

    this.getDeck();
  }
  getAssessment(options = {}){
    let assessment = this.getOption("assessment");
    const assessmentID = assessment ? assessment.id : this.getOption("assessmentID");
    if(!assessmentID){ return; }

    const assessmentCacheKey = this.cacheKey("assessment", assessmentID);
    const hasResults = (data)=>(data && data.personality_types && data.personality_types.length > 0);
    const resultsCacheKey = `${assessmentCacheKey}-results`;
    const setData = (data)=>this.setState({assessmentID: data.id, assessment: data, deck: null});

    if(hasResults(assessment)){ return setData(assessment); }

    assessment = this.cacheGet(resultsCacheKey);
    if(hasResults(assessment)){ return setData(assessment); }

    if(options.force || !this.traitify.ui.requests[assessmentCacheKey]){
      this.traitify.ui.requests[assessmentCacheKey] = this.traitify.get(`/assessments/${assessmentID}`, {
        data: "slides,archetype,blend,types,traits",
        locale_key: this.i18n.locale
      });
    }

    this.traitify.ui.requests[assessmentCacheKey].then((data)=>{
      if(hasResults(data)){ this.cacheSet(resultsCacheKey, data); }

      this.traitify.ui.trigger(`Assessment.${assessmentID}`, this, data);
      if(!this.following.assessments[assessmentID]){ setData(data); }
    }).catch((error)=>{
      console.warn(error);

      delete this.traitify.ui.requests[assessmentCacheKey];
    });
  }
  getDeck(){
    const {assessment} = this.state;
    const deckID = assessment && assessment.deck_id;
    if(!deckID){ return; }

    const cacheKey = this.cacheKey("deck", deckID);
    const setData = (data)=>this.setState({deck: data});

    let deck = this.getOption("deck");
    if(deck && deck.id === deckID){ return setData(deck); }

    deck = this.cacheGet(cacheKey);
    if(deck && deck.id === deckID){ return setData(deck); }

    if(!this.traitify.ui.requests[cacheKey]){
      this.traitify.ui.requests[cacheKey] = this.traitify.get(`/decks/${deckID}`, {
        locale_key: this.i18n.locale
      });
    }

    this.traitify.ui.requests[cacheKey].then((data)=>{
      if(data && data.name){ this.cacheSet(cacheKey, data); }

      this.traitify.ui.trigger(`Deck.${deckID}`, this, data);
    }).catch((error)=>{
      console.warn(error);

      delete this.traitify.ui.requests[cacheKey];
    });
  }
  getOption(name){
    if(this.props[name] != null){ return this.props[name]; }
    if(this.props.options && this.props.options[name] != null){ return this.props.options[name]; }
    if(this.traitify && this.traitify.ui.options[name] != null){ return this.traitify.ui.options[name]; }
  }
  isReady(type){
    const {assessment, deck} = this.state;

    switch(type){
      case "deck":
        return deck && !!deck.name;
      case "results":
        return assessment && (assessment.personality_types || []).length > 0;
      case "slides":
        return assessment && (assessment.slides || []).length > 0;
      default:
        return false;
    }
  }
  loadFonts(){
    loadFont();
  }
  setAirbrake(){
    this.airbrake = this.getOption("airbrake");
    if(this.airbrake){ return; }

    this.airbrake = new Airbrake({
      ignoreWindowError: true,
      projectId: "141848",
      projectKey: "c48de83d0f02ea6d598b491878c0c57e"
    });
    this.airbrake.addFilter((notice)=>{
      const host = window.location.host;

      if(host.includes("lvh.me:3000")){
        notice.context.environment = "development";
      }else if(host.includes("stag.traitify.com")){
        notice.context.environment = "staging";
      }else if(host.includes("traitify.com")){
        notice.context.environment = "production";
      }else{
        notice.context.environment = "client";
      }

      notice.context.environment = "production";
      notice.context.version = this.traitify.__version__;

      return notice;
    });
  }
  setI18n(){
    this.i18n = this.getOption("i18n") || new I18n;

    const locale = this.getOption("locale");
    if(locale){ this.i18n.setLocale(locale); }
  }
  setTraitify(){
    this.traitify = this.getOption("traitify") || window.Traitify;
    if(!this.traitify){ throw new Error("Traitify must be passed as a prop or attached to window"); }
  }
  translate(key, options){
    return this.i18n.translate(key, options);
  }
  componentDidCatch(error, info){
    this.airbrake.notify({
      error,
      params: {
        info,
        session: {
          host: this.traitify.host,
          publicKey: this.traitify.publicKey
        }
      }
    });

    this.setState({error});
  }
}
