import Airbrake from "airbrake-js";
import I18n from "lib/i18n";
import {Component} from "preact";
import {getDisplayName, loadFont} from "lib/helpers";

// Unwrap Airbrake's console wrapper
["debug", "log", "info", "warn", "error"].forEach((method)=>{
  if(method in console && console[method].inner){
    console[method] = console[method].inner;
  }
});

export default function withTraitify(WrappedComponent){
  return class TraitifyComponent extends Component{
    static displayName = `Traitify${getDisplayName(WrappedComponent)}`
    constructor(props){
      super(props);

      this.state = {};
      this.setTraitify();
      this.setAirbrake();
      this.setCache();
      this.setI18n();
      this.setListeners();
    }
    componentDidMount(){
      loadFont();

      this.updateAssessment();
    }
    componentDidUpdate(prevProps, prevState){
      if(prevProps.assessmentID !== this.props.assessmentID){
        this.updateAssessment(prevProps.assessmentID);
      }

      if(this.state.followingDeck && prevState.deckID !== this.state.deckID){
        this.updateDeck(prevState.deckID);
      }
    }
    componentWillUnmount(){
      Object.keys(this.listeners).forEach((key)=>{
        this.traitify.ui.off(key, this.listeners[key]);
      });
    }
    componentDidCatch(error, info){
      this.airbrake && this.airbrake.notify({
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
    followDeck(){
      this.setState({followingDeck: true});
    }
    getAssessment(options){
      // TODO: Include locale in key
      const key = `Assessment.${this.props.assessmentID}`;
      const hasResults = (data)=>(data && data.personality_types && data.personality_types.length > 0);
      const setAssessment = (data)=>(this.traitify.ui.trigger(key, this, data));

      // TODO: Verify locale or ignore
      let assessment = this.props.assessment;
      if(hasResults(assessment)){ return setAssessment(assessment); }

      assessment = this.cache.get(key);
      if(hasResults(assessment)){ return setAssessment(assessment); }

      if(this.traitify.ui.requests[key] && !options.force){ return; }

      this.traitify.ui.requests[key] = this.traitify.get(`/assessments/${this.props.assessmentID}`, {
        data: "slides,archetype,blend,types,traits",
        locale_key: this.i18n.locale
      }).then((data)=>{
        if(hasResults(data)){ this.cache.set(key, data); }

        setAssessment(data);
      }).catch((error)=>{
        console.warn(error);

        delete this.traitify.ui.requests[key];
      });
    }
    getDeck(options){
      // TODO: Include locale in key
      const key = `Deck.${this.state.deckID}`;
      const hasData = (data)=>(data && data.name);
      const setDeck = (data)=>(this.traitify.ui.trigger(key, this, data));

      // TODO: Verify locale or ignore
      let deck = this.props.deck;
      if(hasData(deck)){ return setDeck(deck); }

      deck = this.cache.get(key);
      if(hasData(deck)){ return setDeck(deck); }

      if(this.traitify.ui.requests[key] && !options.force){ return; }

      this.traitify.ui.requests[key] = this.traitify.get(`/decks/${this.state.deckID}`, {
        locale_key: this.i18n.locale
      }).then((data)=>{
        if(hasData(data)){ this.cache.set(key, data); }

        setDeck(data);
      }).catch((error)=>{
        console.warn(error);

        delete this.traitify.ui.requests[key];
      });
    }
    isReady = (type)=>{
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
    getOption = (name)=>{
      if(this.props[name] != null){ return this.props[name]; }
      if(this.props.options && this.props.options[name] != null){ return this.props.options[name]; }
      if(this.traitify && this.traitify.ui.options[name] != null){ return this.traitify.ui.options[name]; }
    }
    setAirbrake(){
      if(this.getOption("disableAirbrake")){ return; }

      this.state.airbrake = this.props.airbrake;
      if(this.state.airbrake){ return; }

      this.state.airbrake = new Airbrake({
        ignoreWindowError: true,
        projectId: "141848",
        projectKey: "c48de83d0f02ea6d598b491878c0c57e"
      });
      this.state.airbrake.addFilter((notice)=>{
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
        notice.context.version = this.state.traitify.__version__;

        return notice;
      });
    }
    setCache(){
      this.cache = this.props.cache || {
        get(key){
          try{
            const data = sessionStorage.getItem(key);

            return data ? JSON.parse(data) : null;
          }catch(error){ return; }
        },
        set(key, data){
          try{
            return sessionStorage.setItem(key, JSON.stringify(data));
          }catch(error){ return; }
        }
      };
    }
    setI18n(){
      this.i18n = this.props.i18n || new I18n;

      const locale = this.props.locale;
      if(locale && locale !== this.i18n.locale){ this.i18n.setLocale(locale); }
    }
    setListeners(){
      // TODO: Locale
      //   Triggering this initially
      //   Having this refresh the assessment
      this.listeners = {
        "I18n.setLocale": (_, locale)=>{ this.setState({locale}); }
      };

      Object.keys(this.listeners).forEach((key)=>{
        this.traitify.ui.on(key, this.listeners[key]);
      });
    }
    setTraitify(){
      this.traitify = this.props.traitify || window.Traitify;

      if(!this.traitify){ throw new Error("Traitify must be passed as a prop or attached to window"); }
    }
    updateAssessment(oldAssessmentID){
      if(oldAssessmentID){
        const key = `Assessment.${oldAssessmentID}`;

        this.traitify.ui.off(key, this.listeners[key]);

        delete this.listeners[key];
      }
      if(this.props.assessmentID){
        const key = `Assessment.${this.props.assessmentID}`;

        this.listeners[key] = (_, assessment)=>{
          this.setState({assessment, assessmentID: assessment.id, deck: null, deckID: assessment.deck_id});
        };

        this.traitify.ui.on(key, this.listeners[key]);

        const currentValue = this.traitify.ui.current(key);
        if(currentValue){
          console.log(currentValue);
          this.listeners[key](...currentValue);
        }else{
          this.getAssessment();
        }
      }
    }
    updateDeck(oldDeckID){
      if(oldDeckID){
        const key = `Deck.${oldDeckID}`;

        this.traitify.ui.off(key, this.listeners[key]);

        delete this.listeners[key];
      }
      if(this.state.deckID){
        const key = `Deck.${this.state.deckID}`;

        this.listeners[key] = (_, deck)=>{
          this.setState({deck});
        };

        this.traitify.ui.on(key, this.listeners[key]);

        const currentValue = this.traitify.ui.current(key);
        if(currentValue){
          this.listeners[key](...currentValue);
        }else{
          this.getDeck();
        }
      }
    }
    render(){
      const {
        airbrake,
        cache,
        followDeck,
        getAssessment,
        getOption,
        i18n,
        isReady,
        props,
        state,
        traitify
      } = this;

      const options = {
        ...props,
        ...state,
        airbrake,
        cache,
        followDeck,
        getAssessment,
        getOption,
        i18n,
        isReady,
        traitify
      };

      return <WrappedComponent {...options} />;
    }
  };
}
