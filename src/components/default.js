import {Component} from "preact";
import withTraitify from "lib/with-traitify";
import Results from "./results";
import SlideDeck from "./slide-deck";

class Default extends Component{
  render(){
    if(this.props.isReady("results")){
      return <Results {...this.props} />;
    }
    if(this.props.isReady("slides")){
      return <SlideDeck {...this.props} />;
    }

    return <div />;
  }
}

export {Default as Component};
export default withTraitify(Default);
