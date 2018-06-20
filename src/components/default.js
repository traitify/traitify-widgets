import {h, Component} from "preact";

import Results from "./results";
import SlideDeck from "./slide-deck";

export default class Default extends Component{
  shouldLoadSlideDeck(){
    return (this.props.assessment.slides || []).length !== 0;
  }
  shouldLoadResults(){
    return (this.props.assessment.personality_types || []).length !== 0;
  }
  render(){
    if(this.shouldLoadResults()){
      return <Results {...this.props} />;
    }
    if(this.shouldLoadSlideDeck()){
      return <SlideDeck {...this.props} />;
    }

    return <div />;
  }
}
