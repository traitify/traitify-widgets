import { h, Component } from "preact";

import Results from "./results/index";
import SlideDeck from "./slidedeck/index";

export default class Default extends Component {
  shouldLoadSlideDeck (){
    return (this.props.assessment.slides || []).length != 0
  }
  render() {
    return (
      <div>
        {this.shouldLoadSlideDeck() ?(
          <SlideDeck {...this.props} />
        ):(
          <Results {...this.props} />
        )}
      </div>
    )
  }
}
