import I18n from "./i18n";

export default class TraitifyState{
  constructor(client){
    this.state = {
      client,
      assessment: {},
      deck: {},
      i18n: new I18n
    };

    this.state.fetch = this.fetch.bind(this);
    this.state.fetchDeck = this.fetchDeck.bind(this);
    this.state.resultsReady = this.resultsReady.bind(this);
    this.state.deckReady = this.deckReady.bind(this);
    this.state.setState = this.setState.bind(this);
    this.state.translate = (key, options)=>this.state.i18n.translate(key, options);
    this.state.triggerCallback = this.triggerCallback.bind(this);
  }
  setup(options = {}){
    options.locale && this.state.i18n.setLocale(options.locale);

    Object.keys(options).forEach((key)=>{
      this.state[key] = options[key];
    });

    this.state.fetch();
  }
  fetch(){
    let storeKey = `results-${this.state.assessmentId}-${this.state.i18n.locale}`;
    let setData = (data)=>{
      this.state.i18n.locale || this.state.i18n.setLocale(data.locale_key);
      this.state.assessment = data;
      this.state.deck = {};
      this.triggerCallback("Main", "fetch", this);
      this.triggerCallback("Shared", "setState", this);
    };

    if(sessionStorage.getItem(storeKey)){
      setData(JSON.parse(sessionStorage.getItem(storeKey)));
    }else{
      this.state.client.get(`/assessments/${this.state.assessmentId}?data=slides,blend,types,traits&locale_key=${this.state.i18n.locale}`).then((data)=>{
        if(data && data.personality_types && data.personality_types.length > 0){
          sessionStorage.setItem(storeKey, JSON.stringify(data));
        }
        setData(data);
      }).catch((error)=>{ console.warn(error); });
    }
  }
  fetchDeck(){
    if(this.state.fetchingDeck || !this.state.assessment.deck_id){ return; }

    let storeKey = `deck-${this.state.assessment.deck_id}-${this.state.i18n.locale}`;
    let setData = (data)=>{
      this.state.fetchingDeck = false;
      this.state.deck = data;
      this.triggerCallback("Main", "fetchDeck", this);
      this.triggerCallback("Shared", "setState", this);
    };

    if(sessionStorage.getItem(storeKey)){
      setData(JSON.parse(sessionStorage.getItem(storeKey)));
    }else{
      this.state.fetchingDeck = true;
      this.state.client.get(`/decks/${this.state.assessment.deck_id}?locale_key=${this.state.i18n.locale}`).then((data)=>{
        if(data && data.name){
          sessionStorage.setItem(storeKey, JSON.stringify(data));
          setData(data);
        }
      }).catch((error)=>{ console.warn(error); });
    }
  }
  on(key, callback){
    key = key.toLowerCase();
    this.state.callbacks[key] = this.state.callbacks[key] || [];
    this.state.callbacks[key].push(callback);
    return this;
  }
  resultsReady(){
    let personalityTypes = this.state.assessment.personality_types || [];
    return personalityTypes.length > 0;
  }
  deckReady(){
    return !!this.state.deck.name;
  }
  setState(newState){
    this.state = {...this.state, ...newState};
    this.triggerCallback("Shared", "setState", this);
  }
  translate(key){
    this.state.i18n.translate(key);
  }
  triggerCallback(klass, action, context, options){
    let key = `${klass}.${action}`.toLowerCase();

    if(this.state.callbacks[key]){
      this.state.callbacks[key].forEach((callback)=>{
        callback.apply(this, [context, options]);
      });
    }

    if(this.state.callbacks.all){
      this.state.callbacks.all.forEach((callback)=>{
        callback.apply(this, [klass, action, context, options]);
      });
    }
  }
}
