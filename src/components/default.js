import { h, Component } from "preact";

import Results from "./results";
import SlideDeck from "./slide-deck";

export default class Default extends Component {
  shouldLoadSlideDeck () {
    return (this.props.assessment.slides || []).length != 0;
  }
  shouldLoadResults () {
    return (this.props.assessment.personality_types || []).length != 0;
  }
  render() {
    let widget = <div />;
    if (this.shouldLoadSlideDeck()){
      widget = <SlideDeck {...this.props} />;
    }
    if (this.shouldLoadResults()){
      widget = <Results {...this.props} />;
    }
    return widget;
  }
}
