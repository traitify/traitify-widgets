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
    let state = {};

    this.state = state;
    this.state.setState = function(newState){
      com.setState(newState);
    }
    this.state.fetch = this.fetch.bind(this);

    this.i18n = new I18n;
    this.state.translate = (key) => com.i18n.translate(key);

    return this;
  }

  componentWillMount(){
    let com = this;
    Object.keys(this.props).forEach((key)=>{
      com.state[key] = com.props[key];
    })
    com.state.assessment = {};
    this.setState(this.state, ()=>{
        com.fetch();
    })
  }

  fetch (){
    let com = this;
    Traitify.get(`/assessments/${com.state.assessmentId}?data=slides,types`).then((data)=>{
      com.i18n.locale || com.i18n.setLocale(data.locale_key);
      com.state.assessment = data;
      com.setState(com.state);
    })
  }

  render() {
    var component = components[this.props.componentName || "Default"];

    return h(component, this.state);
  }
}
