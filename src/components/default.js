import { h, Component } from "preact";

import Results from "./results/index";
import SlideDeck from "./slidedeck/index";

export default class Default extends Component {
  shouldLoadSlideDeck (){
    return (this.props.assessment.slides || []).length != 0
  }
  shouldLoadResults (){
    return (this.props.assessment.personality_types || []).length != 0
  }
  render() {
    var widget = <div />;
    if(this.shouldLoadSlideDeck()){
      widget = <SlideDeck {...this.props} />;
    }
    if(this.shouldLoadResults()){
      widget = <Results {...this.props} />;
    }
    return widget;
  }
}
